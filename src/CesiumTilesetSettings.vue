<script lang="ts" setup>
  import { inject, onUnmounted, ref, watch } from 'vue';
  import { VSheet, VContainer, VRow, VCol } from 'vuetify/components';
  import { VcsFormSection } from '@vcmap/ui';
  import { type CesiumTilesetLayer, LayerState } from '@vcmap/core';
  import type { VcsUiApp } from '@vcmap/ui';
  import LabeledSlider from './components/LabeledSlider.vue';

  const props = defineProps<{ layerName: string }>();
  const emit = defineEmits(['close']);

  const screenSpaceErrorDetails = { min: 0, max: 64, step: 1 };

  const app = inject('vcsApp') as VcsUiApp;
  const layer = app.layers.getByKey(props.layerName) as CesiumTilesetLayer;

  const sse = ref(layer.screenSpaceError);
  watch(sse, () => {
    layer.setMaximumScreenSpaceError(sse.value);
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
      <v-container class="pa-1">
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
  </v-sheet>
</template>

<style lang="scss" scoped></style>
