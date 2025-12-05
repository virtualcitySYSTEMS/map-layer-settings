<script lang="ts" setup>
  import { inject, onUnmounted, ref, watch } from 'vue';
  import { VSheet, VContainer, VRow, VCol } from 'vuetify/components';
  import { VcsFormSection } from '@vcmap/ui';
  import { LayerState, type PointCloudLayer } from '@vcmap/core';
  import type { VcsUiApp } from '@vcmap/ui';
  import { parseNumber } from '@vcsuite/parsers';
  import LabeledSlider from './components/LabeledSlider.vue';
  import PointcloudAdvancedSettings from './components/PointcloudAdvancedSettings.vue';

  const props = defineProps<{ layerName: string }>();
  const emit = defineEmits(['close']);

  const pointSizeDetails = { min: 1, max: 32, step: 1 };
  const screenSpaceErrorDetails = { min: 0, max: 64, step: 1 };

  const app = inject('vcsApp') as VcsUiApp;
  const map = app.maps.activeMap!;
  const layer = app.layers.getByKey(props.layerName) as PointCloudLayer;

  const implementation = layer.getImplementationsForMap(map)?.[0];
  const shading = implementation?.cesium3DTileset?.pointCloudShading;

  const sse = ref(layer.screenSpaceError);
  const pointSize = ref(parseNumber(layer.pointSize, 1));
  const isAttenuationEnabled = ref(shading?.attenuation ?? false);
  watch(sse, () => {
    layer.setMaximumScreenSpaceError(sse.value);
  });
  watch(pointSize, () => {
    if (!isAttenuationEnabled.value) {
      layer.pointSize = pointSize.value;
    }
  });
  watch(isAttenuationEnabled, (enabled) => {
    layer.pointSize = enabled ? undefined : pointSize.value;
  });

  const mapListener = app.maps.mapActivated.addEventListener((m) => {
    if (!layer.isSupported(m)) {
      emit('close');
    }
  });
  const layerStateListener = layer.stateChanged.addEventListener(() => {
    if (layer.state === LayerState.INACTIVE) {
      emit('close');
    }
  });

  onUnmounted(() => {
    mapListener();
    layerStateListener();
  });
</script>

<template>
  <v-sheet class="pa-0">
    <vcs-form-section heading="layerSettings.generalSettings">
      <v-container class="pa-2">
        <v-row no-gutters>
          <v-col>
            <LabeledSlider
              v-model="pointSize"
              name="pointcloud.pointSize"
              :min="pointSizeDetails.min"
              :max="pointSizeDetails.max"
              :step="pointSizeDetails.step"
              :tooltip="
                isAttenuationEnabled
                  ? 'layerSettings.pointcloud.hints.pointSizeDisabled'
                  : ''
              "
              :disabled="isAttenuationEnabled"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <LabeledSlider
              v-model="sse"
              name="pointcloud.screenSpaceError"
              :tooltip="`layerSettings.pointcloud.hints.screenSpaceError`"
              :min="screenSpaceErrorDetails.min"
              :max="screenSpaceErrorDetails.max"
              :step="screenSpaceErrorDetails.step"
            />
          </v-col>
        </v-row>
      </v-container>
    </vcs-form-section>
    <PointcloudAdvancedSettings
      v-if="shading"
      :layer-name="layerName"
      @update:shading-attenuation="(v) => (isAttenuationEnabled = v)"
    />
    <vcs-form-section
      v-else
      heading="layerSettings.advancedSettings"
      expandable
    >
      <div class="pa-1">
        {{ $t('layerSettings.pointcloud.noVisualization') }}
      </div>
    </vcs-form-section>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
