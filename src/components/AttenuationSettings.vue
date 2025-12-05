<script setup lang="ts">
  import { computed } from 'vue';
  import { VcsCheckbox } from '@vcmap/ui';
  import { VCol, VRow } from 'vuetify/components';
  import LabeledSlider from './LabeledSlider.vue';

  const geometricErrorScaleDetails = { min: 0, max: 2, step: 0.1 };
  const attenuationDetails = { min: 0, max: 32, step: 1 };
  const baseResolutionDetails = { min: 0, max: 10, step: 0.1 };

  const attenuation = defineModel('attenuation', {
    type: Boolean,
    default: false,
  });
  const geometricErrorScale = defineModel('geometricErrorScale', {
    type: Number,
    default: 0,
  });
  const maximumAttenuation = defineModel<number | undefined>(
    'maximumAttenuation',
    {
      type: Number,
      default: undefined,
    },
  );
  const baseResolution = defineModel('baseResolution', {
    type: Number,
    default: undefined,
  });
  const useMaxAttenuation = computed({
    get: () => maximumAttenuation.value !== undefined,
    set: (value) => {
      if (value) {
        maximumAttenuation.value = 16;
      } else {
        maximumAttenuation.value = undefined;
      }
    },
  });
</script>

<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <VcsCheckbox
          v-model="attenuation"
          label="layerSettings.pointcloud.enableAttenuation"
        />
      </v-col>
    </v-row>
    <div v-if="attenuation" class="ml-4">
      <v-row no-gutters>
        <v-col>
          <LabeledSlider
            v-model="geometricErrorScale"
            name="pointcloud.geometricErrorScale"
            :tooltip="`layerSettings.pointcloud.hints.geometricErrorScale`"
            :min="geometricErrorScaleDetails.min"
            :max="geometricErrorScaleDetails.max"
            :step="geometricErrorScaleDetails.step"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <LabeledSlider
            v-model="baseResolution"
            name="pointcloud.baseResolution"
            :tooltip="`layerSettings.pointcloud.hints.baseResolution`"
            :min="baseResolutionDetails.min"
            :max="baseResolutionDetails.max"
            :step="baseResolutionDetails.step"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <vcs-checkbox
            v-model="useMaxAttenuation"
            label="layerSettings.pointcloud.useMaxAttenuation"
          ></vcs-checkbox
        ></v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <LabeledSlider
            v-model="maximumAttenuation"
            :disabled="!useMaxAttenuation"
            name="pointcloud.maximumAttenuation"
            :tooltip="`layerSettings.pointcloud.hints.maximumAttenuation`"
            :min="attenuationDetails.min"
            :max="attenuationDetails.max"
            :step="attenuationDetails.step"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
