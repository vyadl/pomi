<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let value;
  export let wide = false;
  export let autofocus = false;
  export let label = false;
  export let labelText = '';
  let inputEl;

onMount(() => {
  if (autofocus) {
    inputEl.focus();
  }
});

  const dispatch = createEventDispatcher();
</script>

{#if label}
  <label class="label">
    <div class="label-text">{labelText}</div>
    <input
      type="text"
      class="text-input"
      class:wide
      bind:value
      on:change="{dispatch('change', value)}"
      bind:this={inputEl}
    />
  </label>
{:else}
  <input
    type="text"
    class="text-input"
    class:wide
    bind:value
    bind:this={inputEl}
    on:change="{dispatch('change', value)}"
  />
{/if}

<style lang="scss">
  .label {
    display: block;
  }
  .label-text {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
    color: #888;
  }
  .text-input {
    background: none;
    border: none;
    border-bottom: 2px solid #444;
    transition: border-color 0.2s;
    color: #aaa;
    font-size: 14px;
    padding: 5px;
    &.wide {
      width: 100%;
    }
    &:focus {
      outline: none;
      border-bottom-color: #888;
    }
  }
</style>
