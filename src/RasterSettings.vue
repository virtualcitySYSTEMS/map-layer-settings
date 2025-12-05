<script lang="ts" setup>
  import { inject, onUnmounted, ref, watch } from 'vue';
  import { VSheet } from 'vuetify/components';
  import type {
    RasterLayer,
    RasterLayerCesiumImpl,
    RasterLayerOpenlayersImpl,
  } from '@vcmap/core';
  import { LayerState } from '@vcmap/core';
  import type { VcsUiApp } from '@vcmap/ui';
  import { parseNumber } from '@vcsuite/parsers';
  import LabeledSlider from './components/LabeledSlider.vue';

  const props = defineProps({
    layerName: { type: String, required: true },
  });
  const emit = defineEmits(['close']);

  const app = inject('vcsApp') as VcsUiApp;
  const layer = app.layers.getByKey(props.layerName) as RasterLayer<
    RasterLayerCesiumImpl | RasterLayerOpenlayersImpl
  >;

  const opacity = ref(parseNumber(layer.opacity, 1));
  watch(opacity, () => {
    layer.opacity = opacity.value;
  });

  const mapListener = app.maps.mapActivated.addEventListener((map) => {
    if (!layer.isSupported(map)) {
      emit('close');
    }
  });
  const layerStateListener = layer.stateChanged.addEventListener((state) => {
    if (state === LayerState.INACTIVE) {
      emit('close');
    }
  });

  onUnmounted(() => {
    mapListener();
    layerStateListener();
  });
</script>

<template>
  <v-sheet class="layer-raster-settings px-1">
    <LabeledSlider v-model="opacity" name="raster.opacity" use-percentage />
  </v-sheet>
</template>

<style lang="scss" scoped></style>
