import {detectTextDirection} from './direction.ts';
import {STYLE_ELEMENT_ID, STYLE_TEXT} from './styles.ts';

export const CONTENT_SELECTOR = [
  '[data-testid="post-message-text"]',
  '.post-message__text',
  '.post-message__text > :is(p, ul, ol, blockquote, h1, h2, h3, h4, h5, h6, .tex)',
  '.textbox-preview-area',
  '.textbox-preview-area > :is(p, ul, ol, blockquote, h1, h2, h3, h4, h5, h6, .tex)',
  '.markdown__paragraph-inline',
  '.channel-header__description',
  '.channel-header .heading',
  '.SidebarChannelLinkLabel',
].join(', ');

export const EDITOR_SELECTOR = [
  '#post_textbox',
  '#reply_textbox',
  '#edit_textbox',
  '#modal_textbox',
  '#searchBox',
  '#quickSwitchInput',
  '[contenteditable="true"][role="textbox"]',
  'textarea.custom-textarea',
  'textarea[role="textbox"]',
].join(', ');

export const TARGET_SELECTOR = `${CONTENT_SELECTOR}, ${EDITOR_SELECTOR}`;

type OriginalState = {
  direction: string | null;
};

function getElementText(element: HTMLElement): string {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value;
  }
  return element.textContent ?? '';
}

function isElement(node: Node | null): node is Element {
  return node?.nodeType === 1;
}

function canQuery(node: Node): node is Node & ParentNode {
  return typeof (node as Node & Partial<ParentNode>).querySelectorAll === 'function';
}

export class RtlController {
  private readonly tracked = new Set<HTMLElement>();
  private readonly originals = new WeakMap<HTMLElement, OriginalState>();
  private observer?: MutationObserver;
  private started = false;
  private ownsStyleElement = false;

  public constructor(private readonly document: Document = window.document) {}

  public start(): void {
    if (this.started) {
      return;
    }
    this.started = true;
    this.installStyles();
    this.processSubtree(this.document.body);

    this.document.addEventListener('input', this.handleInteractiveUpdate, true);
    this.document.addEventListener('focusin', this.handleInteractiveUpdate, true);

    const Observer = this.document.defaultView?.MutationObserver;
    if (Observer && this.document.body) {
      this.observer = new Observer(this.handleMutations);
      this.observer.observe(this.document.body, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }

  public stop(): void {
    if (!this.started) {
      return;
    }
    this.started = false;
    this.observer?.disconnect();
    this.observer = undefined;
    this.document.removeEventListener('input', this.handleInteractiveUpdate, true);
    this.document.removeEventListener('focusin', this.handleInteractiveUpdate, true);

    for (const element of [...this.tracked]) {
      this.releaseElement(element);
    }

    if (this.ownsStyleElement) {
      this.document.getElementById(STYLE_ELEMENT_ID)?.remove();
      this.ownsStyleElement = false;
    }
  }

  private readonly handleInteractiveUpdate = (event: Event): void => {
    if (!isElement(event.target as Node | null)) {
      return;
    }
    this.updateMatchingAncestors(event.target as Element);
  };

  private readonly handleMutations = (mutations: MutationRecord[]): void => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        const parent = mutation.target.parentElement;
        if (parent) {
          this.updateMatchingAncestors(parent);
        }
        continue;
      }

      for (const node of mutation.removedNodes) {
        this.releaseSubtree(node);
      }

      for (const node of mutation.addedNodes) {
        this.processSubtree(node);
        const parent = node.parentElement;
        if (parent) {
          this.updateMatchingAncestors(parent);
        }
      }
    }
  };

  private installStyles(): void {
    if (this.document.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }
    const style = this.document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = STYLE_TEXT;
    this.document.head.append(style);
    this.ownsStyleElement = true;
  }

  private processSubtree(node: Node | null): void {
    if (!node) {
      return;
    }

    if (isElement(node) && node.matches(TARGET_SELECTOR)) {
      this.updateElement(node);
    }

    if (canQuery(node)) {
      node.querySelectorAll(TARGET_SELECTOR).forEach((element) => this.updateElement(element));
    }
  }

  private releaseSubtree(node: Node | null): void {
    if (!node) {
      return;
    }

    if (isElement(node)) {
      this.releaseElement(node as HTMLElement);
    }

    if (canQuery(node)) {
      node.querySelectorAll('.mm-prtl-target').forEach((element) =>
        this.releaseElement(element as HTMLElement),
      );
    }
  }

  private releaseElement(element: HTMLElement): void {
    if (!this.tracked.has(element)) {
      return;
    }

    const original = this.originals.get(element);
    if (original?.direction === null) {
      element.removeAttribute('dir');
    } else if (original?.direction !== undefined) {
      element.setAttribute('dir', original.direction);
    }
    element.classList.remove('mm-prtl-target', 'mm-prtl-content', 'mm-prtl-editor');
    this.tracked.delete(element);
    this.originals.delete(element);
  }

  private updateMatchingAncestors(element: Element): void {
    let current: Element | null = element;
    while (current) {
      if (current.matches(TARGET_SELECTOR)) {
        this.updateElement(current);
      }
      current = current.parentElement;
    }
  }

  private updateElement(element: Element): void {
    const htmlElement = element as HTMLElement;
    const existingDirection = htmlElement.getAttribute('dir');

    if (!this.tracked.has(htmlElement)) {
      // Respect an explicit direction selected by Mattermost or another plugin.
      if (existingDirection && existingDirection !== 'auto') {
        return;
      }
      this.originals.set(htmlElement, {direction: existingDirection});
      this.tracked.add(htmlElement);
    }

    const isEditor = htmlElement.matches(EDITOR_SELECTOR);
    htmlElement.setAttribute('dir', detectTextDirection(getElementText(htmlElement)));
    htmlElement.classList.add('mm-prtl-target');
    htmlElement.classList.toggle('mm-prtl-editor', isEditor);
    htmlElement.classList.toggle('mm-prtl-content', !isEditor);
  }
}
