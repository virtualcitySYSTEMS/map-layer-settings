<script setup lang="ts">
  import { VRow } from 'vuetify/components';
  import { useProxiedAtomicModel, VcsLabel, VcsSlider } from '@vcmap/ui';

  /** @description stylized component, rendering a row with a label and an inputfield, and another with a slider. */
  const emit = defineEmits(['update:modelValue']);
  const props = defineProps({
    modelValue: { type: Number, default: NaN },
    /** The name of the value to be modeled. Will be translated. */
    name: { type: String, required: true },
    tooltip: { type: String, default: undefined },
    /** Whether to render the inputfield and the slider as disabled. */
    disabled: { type: Boolean, default: false },
    /** Whether to display the value as percentage. Displays values as a rounded percentage. */
    usePercentage: { type: Boolean, default: false },
    /** The minimum value of the slider. */
    min: { type: Number, default: 0 },
    /** The maximum value of the slider. */
    max: { type: Number, default: 1 },
    /** The step value of the slider. */
    step: { type: Number, default: 0.01 },
  });

  const localValue = useProxiedAtomicModel(props, 'modelValue', emit);

  function getVisibleValue(value: number): number | string {
    if (isFinite(value) && !props.disabled) {
      if (props.usePercentage) {
        return `${Math.round(((value - props.min) / (props.max - props.min)) * 100)}%`;
      }
      return value;
    }
    return '';
  }
</script>

<template>
  <div>
    <v-row no-gutters class="justify-space-between px-1">
      <VcsLabel :html-for="name" :help-text="tooltip" class="pt-1 gc-2">
        {{ $t(`layerSettings.${name}`) }}
      </VcsLabel>
      <div class="d-flex align-center">
        {{ getVisibleValue(localValue) }}
      </div>
    </v-row>
    <v-row no-gutters class="slider-container">
      <VcsSlider
        :id="name"
        v-model.number="localValue"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
      />
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
  .slider-container {
    padding-inline: 2px;
    overflow: hidden;
    :deep(.vcs-slider) {
      overflow: visible !important;
    }
  }
</style>
