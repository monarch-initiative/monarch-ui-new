import { ComponentOptions } from "@vue/runtime-core";
import { debounce } from "lodash";

// persist mixin
// usage: data() { return { foo } }, persist: ["foo"]
// persists a component's data (local state) in local storage

const storage = window.localStorage;

const persist: ComponentOptions = {
  // before component instance is created
  created(): void {
    // get what data keys to persist from $persist option attached to component
    const keys: Array<string> = this.$options.persist || [];

    // if no keys specified, do nothing
    if (!keys.length) return;

    // read initial values from storage
    for (const key of keys) {
      const value = read(key);
      if (value !== null) this[key] = value;
    }

    // setup listeners for writing values to storage on change
    for (const key of keys)
      this.$watch(key, (value: unknown) => debouncedWrite(key, value));
  },
};

export default persist;

// read value from storage
const read = (key = "") => {
  const string = storage.getItem(key) || "";
  if (!string) return null;
  try {
    return JSON.parse(string);
  } catch (error) {
    console.error(`Error parsing key "${key}" from storage`);
    return null;
  }
};

// write value to storage
const write = (key = "", value: unknown) => {
  if (!key) return;
  let string: string;
  try {
    string = JSON.stringify(value);
  } catch (error) {
    console.error(`Error stringifying key "${key}" for storage"`);
    return;
  }
  try {
    storage.setItem(key, string);
  } catch (error) {
    console.error(`Error setting key "${key}" to storage`);
    return;
  }
};

const debouncedWrite = debounce(write, 1000);
