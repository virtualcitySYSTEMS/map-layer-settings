<template>
  <AbstractConfigEditor v-bind="{ ...$attrs, ...$props }" @submit="apply">
    <VcsFormSection
      heading="layerSettings.config.enableFor"
      help-text="layerSettings.config.enableForHelp"
    >
      <v-container v-for="(type, i) in supportedTypes" :key="i" class="pa-1">
        <v-row no-gutters>
          <VcsCheckbox
            v-model="localConfig[type]"
            :label="`layerSettings.config.${type}Layers`"
          />
        </v-row>
      </v-container>
    </VcsFormSection>
  </AbstractConfigEditor>
</template>

<script lang="ts">
  import { AbstractConfigEditor, VcsCheckbox, VcsFormSection } from '@vcmap/ui';
  import type { PropType } from 'vue';
  import { defineComponent, ref, toRaw } from 'vue';
  import { VContainer, VRow } from 'vuetify/components';
  import type { LayerSettingsConfig } from './index.js';

  export function getDefaultOptions(): Required<LayerSettingsConfig> {
    return {
      raster: true,
      pointcloud: true,
    };
  }

  export default defineComponent({
    name: 'ConfigEditor',
    components: {
      VContainer,
      VRow,
      AbstractConfigEditor,
      VcsCheckbox,
      VcsFormSection,
    },
    props: {
      getConfig: {
        type: Function as PropType<() => LayerSettingsConfig>,
        required: true,
      },
      setConfig: {
        type: Function as PropType<(config: object | undefined) => void>,
        required: true,
      },
    },
    setup(props) {
      const localConfig = ref<LayerSettingsConfig>({
        ...props.getConfig(),
        ...getDefaultOptions(),
      });
      const supportedTypes = Object.keys(
        getDefaultOptions(),
      ) as (keyof LayerSettingsConfig)[];

      return {
        localConfig,
        supportedTypes,
        apply(): void {
          props.setConfig(structuredClone(toRaw(localConfig.value)));
        },
      };
    },
  });
</script>

<style scoped></style>
