<script setup lang="ts">
  import { VcsCheckbox } from '@vcmap/ui';
  import { VCol, VRow } from 'vuetify/components';
  import LabeledSlider from './LabeledSlider.vue';

  const strengthDetails = { min: 0, max: 10, step: 0.01 };
  const radiusDetails = { min: 0, max: 10, step: 0.1 };

  const eyeDomeLighting = defineModel('eyeDomeLighting', {
    type: Boolean,
    default: true,
  });
  const eyeDomeLightingStrength = defineModel('eyeDomeLightingStrength', {
    type: Number,
    default: 1,
  });
  const eyeDomeLightingRadius = defineModel('eyeDomeLightingRadius', {
    type: Number,
    default: 1,
  });
</script>

<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <VcsCheckbox
          v-model="eyeDomeLighting"
          label="layerSettings.pointcloud.enableEyeDomeLighting"
        />
      </v-col>
    </v-row>
    <div v-if="eyeDomeLighting" class="ml-4">
      <v-row no-gutters>
        <v-col
          ><LabeledSlider
            v-model="eyeDomeLightingStrength"
            name="pointcloud.eyeDomeLightingStrength"
            :tooltip="`layerSettings.pointcloud.hints.eyeDomeLightingStrength`"
            :min="strengthDetails.min"
            :max="strengthDetails.max"
            :step="strengthDetails.step"
        /></v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <LabeledSlider
            v-model="eyeDomeLightingRadius"
            name="pointcloud.eyeDomeLightingRadius"
            :tooltip="`layerSettings.pointcloud.hints.eyeDomeLightingRadius`"
            :min="radiusDetails.min"
            :max="radiusDetails.max"
            :step="radiusDetails.step"
        /></v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
