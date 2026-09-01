import manifest from '../../plugin.json';

import {RtlController} from './controller.ts';

type RootComponent = () => null;

type PluginRegistry = {
  registerRootComponent(component: RootComponent): string;
};

type ReactRuntime = {
  useEffect(effect: () => void | (() => void), dependencies: readonly unknown[]): void;
};

const controllers = new Set<RtlController>();

function RtlRoot(): null {
  window.React.useEffect(() => {
    const controller = new RtlController(document);
    controllers.add(controller);
    controller.start();

    return () => {
      controller.stop();
      controllers.delete(controller);
    };
  }, []);

  return null;
}

class PersianRtlPlugin {
  public initialize(registry: PluginRegistry): void {
    registry.registerRootComponent(RtlRoot);
  }

  public uninitialize(): void {
    for (const controller of controllers) {
      controller.stop();
    }
    controllers.clear();
  }
}

declare global {
  interface Window {
    React: ReactRuntime;
    registerPlugin(pluginId: string, plugin: PersianRtlPlugin): void;
  }
}

window.registerPlugin(manifest.id, new PersianRtlPlugin());
