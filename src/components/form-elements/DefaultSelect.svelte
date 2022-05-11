<script>
  import { createEventDispatcher } from 'svelte';

  export let value;
  export let wide = false;
  export let label = '';
  export let errormessage = '';
  export let options = [];
  export let pure = false;
  export let nomargin = false;
  export let right = false;
  export let datatitle = '';
  export let fontinherit = false;

const dispatch = createEventDispatcher();

function onChange() {
  errormessage = '';
  dispatch('change', value);
}
</script>
<div
  class="default-select"
  class:wide
  class:pure
  class:nomargin
  class:right
  class:fontinherit
  data-title="{datatitle}"
>
  {#if label}
    <label class="label">
      <div class="label-text">{label}</div>
      <select
        class="select"
        bind:value
        on:change={onChange}
      >
        {#each options as option}
          <option value="{option.value}">{option.text}</option>
        {/each}
      </select>
    </label>
  {:else}
  <select
    class="select"
    bind:value
    on:change={onChange}
  >
    {#each options as option}
      <option value="{option.value}">{option.text}</option>
    {/each}
  </select>
  {/if}
  {#if errormessage}
    <div class="error-message">{errormessage}</div>
  {/if}
</div>

<style lang="scss">
  .default-select {
    position: relative;
    .label {
      display: block;
      cursor: pointer;
    }
    .label-text {
      display: block;
      margin-bottom: 7px;
      font-size: 12px;
      color: #888;
    }
    .select {
      background: none;
      border: none;
      border-bottom: 2px solid #444;
      transition: border-color .2s, color .2s;
      color: var(--color-text-softest);
      letter-spacing: .5px;
      font-size: 14px;
      padding: 5px;
      cursor: pointer;
      &.wide {
        width: 100%;
      }
      &:focus {
        outline: none;
        border-bottom-color: #888;
      }
      &:hover {
        color: var(--color-text-softer);
      }
    }
    &.wide {
      .select {
        width: 100%;
      }
    }
    &.pure {
      .select {
        border-bottom: none;
        appearance: none;
      }
    }
    &.nomargin {
      .select {
        margin: 0;
      }
    }
    &.right {
      .select {
        text-align: right;
      }
    }
    &.fontinherit {
      .select {
        font: inherit;
        letter-spacing: inherit;
      }
    }
    .error-message {
      font-size: 12px;
      padding-left: 5px;
      color: #999;
    }
  }
</style>
