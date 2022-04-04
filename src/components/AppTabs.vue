<!--
  tab buttons that conditionally show their corresponding slots

  references:
  https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/tabs/tabs-1/tabs.html
-->

<template>
  <AppFlex role="tablist" :aria-label="name">
    <AppButton
      v-for="(tab, index) in tabs"
      :id="`tab-${id}-${tab.id}`"
      :key="index"
      v-tippy="tab.tooltip"
      :text="tab.text"
      :icon="tab.icon"
      design="circle"
      :color="selected === tab.id ? 'primary' : 'none'"
      :aria-label="tab.text"
      :aria-selected="selected === tab.id"
      :aria-controls="`panel-${id}-${tab.id}`"
      :tabindex="selected === tab.id ? 0 : undefined"
      role="tab"
      @click="selected = tab.id"
      @keydown="onKeydown"
    />
  </AppFlex>

  <!-- hidden element to serve as aria panel -->
  <div
    :id="`panel-${id}-${selected}`"
    :aria-labelledby="`tab-${id}-${selected}`"
    role="tabpanel"
    :aria-label="'Tab content below'"
    :style="{ display: 'contents' }"
  ></div>

  <!-- description of tab -->
  <template v-if="description && showDescription">
    <p>
      {{ description }}
    </p>
    <hr />
  </template>

  <!-- tab panel content -->
  <slot :name="selected"></slot>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { uniqueId } from "lodash";
import { wrap } from "@/util/math";
import { useRouter, useRoute } from "vue-router";

// route info
const router = useRouter();
const route = useRoute();

interface Tab {
  // page-wide unique id of tab
  id: string;
  // tab button props
  text?: string;
  icon?: string;
  description?: string;
  tooltip?: string;
}
type Tabs = Array<Tab>;

interface Props {
  // list of tabs with info
  tabs: Tabs;
  // default selected tab id
  default?: string;
  // name of tab group
  name: string;
  // whether to show description paragraph
  showDescription?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  default: "",
  showDescription: true,
});

interface Emits {
  (event: "change", selected: string): void;
}

const emit = defineEmits<Emits>();

// unique id for instance of component
const id = ref(uniqueId());
// id of selected tab
const selected = ref(getHash() || props.default || props.tabs[0].id || "");

// description of selected tab
const description = computed(
  () => props.tabs.find((tab) => tab.id === selected.value)?.description
);

// when user presses key on button
function onKeydown(event: KeyboardEvent) {
  if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    // prevent page scroll
    event.preventDefault();

    // move selected tab
    let index = props.tabs.findIndex((tab) => tab.id === selected.value);
    if (event.key === "ArrowLeft") index--;
    if (event.key === "ArrowRight") index++;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = props.tabs.length - 1;

    // update selected, wrapping beyond -1 or options length
    selected.value = props.tabs[wrap(index, 0, props.tabs.length)].id;
  }
}

// get appropriate tab from url hash
function getHash() {
  // set selected tab to id in hash
  const hash = route?.hash?.slice(1) || "";
  // if there is a tab with name equal to hash, return that one
  if (props.tabs.find((tab) => tab.id === hash)) return hash;
  else return "";
}

// when selected tab changes
watch(selected, async () => {
  // focus the selected tab
  const selector = `#tab-${id.value}-${selected.value}`;
  const button = document?.querySelector(selector) as HTMLButtonElement;
  button?.focus();

  // update hash in url
  await router.replace({ ...route, hash: "#" + selected.value });

  // emit event to parent that tab changed
  emit("change", selected.value);
});

// when url hash changes
watch(
  () => route.hash,
  () => {
    if (getHash()) selected.value = getHash();
  }
);
</script>
