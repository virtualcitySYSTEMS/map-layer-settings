<script setup lang="ts">
  import type { PointCloudLayer } from '@vcmap/core';
  import type { VcsAction, VcsUiApp } from '@vcmap/ui';
  import { VcsFormSection } from '@vcmap/ui';
  import { VContainer } from 'vuetify/components';
  import { inject, reactive, ref, toRaw, watch } from 'vue';
  import AttenuationSettings from './AttenuationSettings.vue';
  import EyeDomeShading from './EyeDomeShading.vue';

  const props = defineProps<{ layerName: string }>();
  const emit = defineEmits<{
    (e: 'update:shadingAttenuation', value: boolean): void;
  }>();

  const app = inject('vcsApp') as VcsUiApp;
  const map = app.maps.activeMap!;
  const layer = app.layers.getByKey(props.layerName) as PointCloudLayer;
  const implementation = layer.getImplementationsForMap(map)?.[0];

  const shading = implementation.cesium3DTileset!.pointCloudShading;
  const localShading = ref(structuredClone(shading));
  const defaultShading = structuredClone(shading);
  const resetShading: VcsAction = reactive({
    name: 'reset',
    icon: '$vcsReturn',
    title: 'layerSettings.reset',
    callback: () => {
      localShading.value = structuredClone(defaultShading);
    },
  });

  watch(
    localShading,
    () => {
      Object.assign(shading, structuredClone(toRaw(localShading.value)));
      emit('update:shadingAttenuation', localShading.value.attenuation);
    },
    { deep: true },
  );
</script>

<template>
  <vcs-form-section
    v-if="localShading"
    heading="layerSettings.advancedSettings"
    help-text="layerSettings.pointcloud.hints.advancedSettings"
    :header-actions="[resetShading]"
    expandable
  >
    <!-- @vue-ignore -->
    <template #help>
      <div>
        {{ $t('layerSettings.pointcloud.hints.advancedSettings1') }}
        <a
          target="_blank"
          href="https://cesium.com/learn/cesiumjs/ref-doc/PointCloudShading.html"
        >
          {{ $t('layerSettings.pointcloud.hints.advancedSettings2') }}
        </a>
      </div>
    </template>
    <v-container class="pa-2">
      <attenuation-settings
        v-model:attenuation="localShading.attenuation"
        v-model:geometric-error-scale="localShading.geometricErrorScale"
        v-model:maximum-attenuation="localShading.maximumAttenuation"
        v-model:base-resolution="localShading.baseResolution"
      />
      <eye-dome-shading
        v-if="localShading.attenuation"
        v-model:eye-dome-lighting="localShading.eyeDomeLighting"
        v-model:eye-dome-lighting-strength="
          localShading.eyeDomeLightingStrength
        "
        v-model:eye-dome-lighting-radius="localShading.eyeDomeLightingRadius"
      />
    </v-container>
  </vcs-form-section>
</template>
