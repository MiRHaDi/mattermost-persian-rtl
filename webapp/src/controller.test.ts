import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {RtlController} from './controller.ts';
import {STYLE_ELEMENT_ID} from './styles.ts';

describe('RtlController', () => {
  let controller: RtlController;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    controller = new RtlController(document);
  });

  afterEach(() => {
    controller.stop();
  });

  it('sets direction on messages, blocks, and editors and installs scoped CSS', () => {
    document.body.innerHTML = `
      <div class="post-message__text" dir="auto">
        <p><span data-mention="everyone">@everyone</span> سلام دنیا</p>
      </div>
      <div id="post_textbox" class="ProseMirror" contenteditable="true" role="textbox">Hello</div>
    `;

    controller.start();

    const message = document.querySelector<HTMLElement>('.post-message__text');
    const paragraph = document.querySelector<HTMLElement>('.post-message__text > p');
    const editor = document.querySelector<HTMLElement>('#post_textbox');

    expect(message?.getAttribute('dir')).toBe('rtl');
    expect(message?.classList.contains('mm-prtl-content')).toBe(true);
    expect(paragraph?.getAttribute('dir')).toBe('rtl');
    expect(editor?.getAttribute('dir')).toBe('ltr');
    expect(editor?.classList.contains('mm-prtl-editor')).toBe(true);
    expect(document.getElementById(STYLE_ELEMENT_ID)).not.toBeNull();
  });

  it('updates a live textarea on input', () => {
    document.body.innerHTML = '<textarea id="reply_textbox" role="textbox"></textarea>';
    controller.start();

    const editor = document.querySelector<HTMLTextAreaElement>('#reply_textbox');
    if (!editor) {
      throw new Error('Fixture editor was not created.');
    }

    editor.value = 'سلام';
    editor.dispatchEvent(new InputEvent('input', {bubbles: true}));
    expect(editor.getAttribute('dir')).toBe('rtl');

    editor.value = 'hello';
    editor.dispatchEvent(new InputEvent('input', {bubbles: true}));
    expect(editor.getAttribute('dir')).toBe('ltr');
  });

  it('processes content inserted after startup without polling', async () => {
    controller.start();
    const message = document.createElement('div');
    message.className = 'post-message__text';
    message.textContent = 'متن تازه';
    document.body.append(message);

    await new Promise<void>((resolve) => queueMicrotask(resolve));
    expect(message.getAttribute('dir')).toBe('rtl');
  });

  it('recomputes both a changed block and its message container', async () => {
    document.body.innerHTML = '<div class="post-message__text"><p>Hello</p></div>';
    controller.start();

    const message = document.querySelector<HTMLElement>('.post-message__text');
    const paragraph = document.querySelector<HTMLElement>('.post-message__text > p');
    if (!message || !paragraph) {
      throw new Error('Message fixture was not created.');
    }
    expect(message.getAttribute('dir')).toBe('ltr');

    paragraph.firstChild!.textContent = 'سلام';
    await new Promise<void>((resolve) => queueMicrotask(resolve));

    expect(paragraph.getAttribute('dir')).toBe('rtl');
    expect(message.getAttribute('dir')).toBe('rtl');
  });

  it('respects an existing explicit direction', () => {
    document.body.innerHTML = '<div class="post-message__text" dir="ltr">سلام</div>';
    controller.start();

    const message = document.querySelector<HTMLElement>('.post-message__text');
    expect(message?.getAttribute('dir')).toBe('ltr');
    expect(message?.classList.contains('mm-prtl-target')).toBe(false);
  });

  it('restores original state when stopped', () => {
    document.body.innerHTML = `
      <div class="post-message__text" dir="auto">سلام</div>
      <textarea id="edit_textbox" role="textbox">hello</textarea>
    `;
    controller.start();
    controller.stop();

    const message = document.querySelector<HTMLElement>('.post-message__text');
    const editor = document.querySelector<HTMLElement>('#edit_textbox');
    expect(message?.getAttribute('dir')).toBe('auto');
    expect(message?.classList.contains('mm-prtl-target')).toBe(false);
    expect(editor?.hasAttribute('dir')).toBe(false);
    expect(editor?.classList.contains('mm-prtl-editor')).toBe(false);
    expect(document.getElementById(STYLE_ELEMENT_ID)).toBeNull();
  });
});
