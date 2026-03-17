import type {
  ContentTreeItem,
  PluginConfigEditor,
  VcsAction,
  VcsPlugin,
  VcsUiApp,
  WindowComponentOptions,
} from '@vcmap/ui';
import {
  createToggleAction,
  LayerContentTreeItem,
  WindowSlot,
  WMSGroupContentTreeItem,
} from '@vcmap/ui';
import type { Layer } from '@vcmap/core';
import { LayerState, PointCloudLayer, RasterLayer } from '@vcmap/core';
import type { Component } from 'vue';
import RasterSettings from './RasterSettings.vue';
import { mapVersion, name, version } from '../package.json';
import de from './i18n/de.json';
import en from './i18n/en.json';
import ConfigEditor, { getDefaultOptions } from './ConfigEditor.vue';
import PointcloudSettings from './PointcloudSettings.vue';

type LayerSettingsState = Record<never, never>;
export type LayerSettingsConfig = {
  raster?: boolean;
  pointcloud?: boolean;
};
type LayerSettingsPlugin = VcsPlugin<
  LayerSettingsConfig,
  LayerSettingsState
> & {
  config: LayerSettingsConfig;
};

const actionName = 'layerSettings.settings';
function getWindowComponentOptions(
  layer: Layer,
  component: Component,
): WindowComponentOptions {
  return {
    id: `layerSettings-${layer.name}`,
    component,
    slot: WindowSlot.DYNAMIC_LEFT,
    props: { layerName: layer.name },
    state: {
      headerTitle: (layer.properties.title as string) ?? layer.name,
      headerIcon:
        'svgString:<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.667 10.667.667 6l6-4.667 6 4.667zm0 1.693.666-.527V12c0 .473.08.927.234 1.333l-.9.714-6-4.667 1.08-.84z" fill="currentColor"/><g clip-path="url(#a)"><path d="M11.987 12.607a1.194 1.194 0 1 1 0-2.389 1.194 1.194 0 0 1 0 2.389m2.535-.864a3 3 0 0 0 .024-.33q-.002-.169-.024-.342l.72-.556a.17.17 0 0 0 .04-.219l-.682-1.18a.17.17 0 0 0-.208-.075l-.85.341a2.5 2.5 0 0 0-.576-.334l-.126-.905A.17.17 0 0 0 12.67 8h-1.366a.17.17 0 0 0-.17.143l-.127.905c-.215.085-.399.2-.576.334l-.85-.341a.17.17 0 0 0-.208.075l-.683 1.18a.17.17 0 0 0 .041.219l.72.556a3 3 0 0 0-.024.341q.002.168.024.331l-.72.567a.17.17 0 0 0-.04.218l.682 1.18a.17.17 0 0 0 .208.076l.85-.345c.177.137.361.253.576.338l.127.904a.17.17 0 0 0 .17.144h1.365a.17.17 0 0 0 .17-.144l.127-.904c.215-.089.4-.201.577-.338l.85.345a.17.17 0 0 0 .207-.075l.683-1.18a.17.17 0 0 0-.041-.22z" fill="currentColor"/></g></svg>',
    },
  };
}
function setupAction(
  app: VcsUiApp,
  item: ContentTreeItem,
  config: LayerSettingsConfig,
  actionListeners: Record<string, () => void>,
): void {
  if (
    item instanceof LayerContentTreeItem ||
    item instanceof WMSGroupContentTreeItem
  ) {
    if (item.actions.some((a) => a.name === actionName)) {
      return;
    }
    const { layerName } = item.toJSON();
    const layer = app.layers.getByKey(layerName);

    let action: VcsAction | undefined;
    let destroy: (() => void) | undefined;

    function createAction(component: Component): {
      action: VcsAction;
      destroy: () => void;
    } {
      return createToggleAction(
        {
          name: actionName,
          disabled: layer?.state === LayerState.INACTIVE,
        },
        getWindowComponentOptions(layer!, component),
        app.windowManager,
        name,
      );
    }

    if (config.raster && layer instanceof RasterLayer) {
      ({ action, destroy } = createAction(RasterSettings));
    } else if (config.pointcloud && layer instanceof PointCloudLayer) {
      ({ action, destroy } = createAction(PointcloudSettings));
    } else {
      return;
    }
    const layerListener = layer.stateChanged.addEventListener((state) => {
      action.disabled = state === LayerState.INACTIVE;
    });

    actionListeners[item.name]?.();
    actionListeners[item.name] = (): void => {
      destroy();
      layerListener();
    };
    item.addAction(action);
  }
}

export default function plugin(
  options: LayerSettingsConfig,
): LayerSettingsPlugin {
  let app: VcsUiApp;
  const config = { ...getDefaultOptions(), ...options };
  const listener: Array<() => void> = [];
  const actionListeners: Record<string, () => void> = {};
  return {
    get name(): string {
      return name;
    },
    get version(): string {
      return version;
    },
    get mapVersion(): string {
      return mapVersion;
    },
    get config(): LayerSettingsConfig {
      return config;
    },
    initialize(vcsUiApp: VcsUiApp): Promise<void> {
      app = vcsUiApp;
      for (const contentTreeItem of vcsUiApp.contentTree) {
        setupAction(app, contentTreeItem, config, actionListeners);
      }
      listener.push(
        vcsUiApp.contentTree.added.addEventListener((contentTreeItem) => {
          setupAction(app, contentTreeItem, config, actionListeners);
        }),
      );
      return Promise.resolve();
    },
    getDefaultOptions,
    toJSON(): LayerSettingsConfig {
      const serial: LayerSettingsConfig = {};
      const defaults = getDefaultOptions();
      Object.keys(config).forEach((key) => {
        const k = key as keyof LayerSettingsConfig;
        if (config[k] !== defaults[k]) {
          serial[k] = config[k];
        }
      });
      return serial;
    },
    i18n: { en, de },
    getConfigEditors(): PluginConfigEditor<object>[] {
      return [
        {
          component: ConfigEditor,
          title: 'Layer Settings Config Editor',
        },
      ];
    },
    destroy(): void {
      listener.forEach((l) => {
        l();
      });
      Object.values(actionListeners).forEach((l) => {
        l();
      });
      [...app.contentTree].forEach((item) => {
        item.removeAction(actionName);
      });
    },
  };
}
