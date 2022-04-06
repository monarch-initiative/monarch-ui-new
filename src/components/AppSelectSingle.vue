<!--
  custom single select

  references:
  https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/combobox/combobox-select-only.html
  https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role
  https://vuetifyjs.com/en/components/selects/
  https://www.downshift-js.com/use-select
-->

<template>
  <div class="select-single">
    <!-- select button -->
    <button
      :id="`select-${id}`"
      class="button"
      :aria-label="name"
      :aria-expanded="expanded"
      :aria-controls="`list-${id}`"
      aria-haspopup="listbox"
      tabindex="0"
      @click="onClick"
      @keydown="onKeydown"
      @blur="onBlur"
    >
      <AppIcon v-if="modelValue?.icon" :icon="modelValue?.icon" />
      <span class="button-label">{{ modelValue?.name || modelValue?.id }}</span>
      <AppIcon
        class="button-icon"
        :icon="expanded ? 'angle-up' : 'angle-down'"
      />
    </button>

    <!-- options list -->
    <div
      v-if="expanded"
      :id="`list-${id}`"
      class="list"
      role="listbox"
      :aria-labelledby="`select-${id}`"
      :aria-activedescendant="`option-${id}-${highlighted}`"
      tabindex="0"
    >
      <div class="grid">
        <div
          v-for="(option, index) in options"
          :id="`option-${id}-${index}`"
          :key="index"
          class="option"
          role="option"
          :aria-selected="selected === index"
          :data-selected="selected === index"
          :data-highlighted="index === highlighted"
          tabindex="0"
          @click="selected = index"
          @mouseenter="highlighted = index"
          @mousedown.prevent=""
          @focusin="() => null"
          @keydown="() => null"
        >
          <span class="option-icon">
            <AppIcon v-if="option.icon" :icon="option.icon" />
          </span>
          <span class="option-label">{{ option.name || option.id }}</span>
          <span class="option-count">{{ option.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { uniqueId } from "lodash";
import { Option, Options } from "./AppSelectSingle";
import { wrap } from "@/util/math";

interface Props {
  // name of the field
  name: string;
  // currently selected item
  modelValue?: Option;
  // list of options to show
  options: Options;
}

const props = defineProps<Props>();

interface Emits {
  // two-way binding value
  (event: "update:modelValue", value: Option): void;
  // when value changed
  (event: "input"): void;
  // when value change "submitted"/"committed" by user
  (event: "change"): void;
}

const emit = defineEmits<Emits>();

// unique id for instance of component
const id = ref(uniqueId());
// whether dropdown is open
const expanded = ref(false);
// index of option that is selected
const selected = ref(getSelected());
// index of option that is highlighted
const highlighted = ref(0);

// open dropdown
function open() {
  expanded.value = true;
  // auto highlight selected option
  highlighted.value = selected.value;
}

// close dropdown
function close() {
  expanded.value = false;
}

// when button clicked
function onClick() {
  // toggle dropdown
  expanded.value ? close() : open();
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
  (document.querySelector(`#select-${id.value}`) as HTMLElement)?.focus();
}

// when button blurred
function onBlur() {
  close();
}

// when user presses key on button
function onKeydown(event: KeyboardEvent) {
  // arrow/home/end keys
  if (["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
    // prevent page scroll
    event.preventDefault();

    // if dropdown open, control highlighted option
    // if dropdown closed, control selected option
    let index = expanded.value ? highlighted.value : selected.value;

    // move value up/down
    if (event.key === "ArrowUp") index--;
    if (event.key === "ArrowDown") index++;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = props.options.length - 1;

    // update value, wrapping beyond 0 or options length
    index = wrap(index, 0, props.options.length);
    if (expanded.value) highlighted.value = index;
    else selected.value = index;
  }

  // enter key to select highlighted option
  if (expanded.value && (event.key === "Enter" || event.key === " ")) {
    // prevent browser re-clicking open button
    event.preventDefault();
    selected.value = highlighted.value;
  }

  // esc key to close dropdown
  if (expanded.value && event.key === "Escape") close();

  // TODO: type ahead
  // not strictly necessary for now because this component only used with a
  // small number of options
}

// get selected option index from model
function getSelected() {
  return props.options.findIndex(
    (option) => option?.id === props.modelValue?.id
  );
}

// when model changes
watch(
  () => props.modelValue,
  () =>
    // update selected index
    (selected.value = getSelected())
);

// when selected index changes
watch(selected, () => {
  // emit updated model
  emit("update:modelValue", props.options[selected.value]);
  close();
});

// when highlighted index changes
watch(highlighted, () =>
  // scroll to highlighted in dropdown
  document
    .querySelector(`#option-${id.value}-${highlighted.value}`)
    ?.scrollIntoView({ block: "nearest" })
);

// when available options change
watch(
  () => props.options,
  () => {
    // if can't find selected value, select first option (if it exists)
    if (selected.value === -1 && props.options.length) selected.value = 0;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.select-single {
  position: relative;
  max-width: 100%;
}

.button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 5px 10px;
  border-radius: $rounded;
  background: $light-gray;
}

.button-label {
  flex-grow: 1;
  text-align: left;
}

.list {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  min-width: 100%;
  max-width: 90vw;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  background: $white;
  box-shadow: $shadow;
  z-index: 2;
}

.grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: 30px;
  justify-content: stretch;
  align-items: stretch;
  min-width: max-content;
}

.option {
  display: contents;
  padding: 5px 10px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background $fast;
}

.option > * {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  overflow: hidden;

  &:first-child {
    padding-left: 10px;
  }

  &:last-child {
    padding-right: 10px;
  }
}

.option[data-selected="true"] > * {
  background: $theme-light;
}

.option[data-highlighted="true"] > * {
  background: $light-gray;
}

.option-icon {
  color: $off-black;
  font-size: 1.2rem;
}

.option-label {
  justify-content: flex-start;
}

.option-count {
  justify-content: flex-end;
  color: $gray;
}
</style>
