<script>
  import { createEventDispatcher } from 'svelte';

  export let value;
  export let wide = false;
  export let pure = false;
  export let noMargin = false;
  export let right = false;
  export let fontInherit = false;
  export let required = false;
  export let label = '';
  export let errorMessage = '';
  export let options = [];

const dispatch = createEventDispatcher();

function onChange() {
  errorMessage = '';
  dispatch('change', value);
}
</script>
<div
  class="custom-select"
  class:wide
  class:pure
  class:right
  class:no-margin="{noMargin}"
  class:font-inherit="{fontInherit}"
>
  <label class="label">
    {#if label}
      <div class="label-text">{label}{required ? '*' : ''}</div>
    {/if}
    <select
      class="select"
      required="{required}"
      bind:value
      on:change={onChange}
    >
      {#each options as option}
        <option value="{option.value}">{option.text}</option>
      {/each}
    </select>
  </label>
  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}
</div>

<style lang="scss">
  .custom-select {
    position: relative;
    .label {
      display: block;
      cursor: pointer;
    }
    .label-text {
      display: block;
      margin-bottom: 7px;
      font-size: 12px;
      color: var(--color-text-softest);
    }
    .select {
      background: none;
      border: none;
      border-bottom: 2px solid var(--color-main-bg-softest);
      border-radius: 0;
      transition: border-color .2s, color .2s;
      color: var(--color-text-softest);
      letter-spacing: .5px;
      font-size: 14px;
      padding: 5px;
      cursor: pointer;
      &:focus {
        outline: none;
        border-bottom-color: var(--color-text-softer);
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
    &.no-margin {
      .select {
        margin: 0;
      }
    }
    &.right {
      .select {
        text-align: right;
      }
    }
    &.font-inherit {
      .select {
        font: inherit;
        letter-spacing: inherit;
      }
    }
    .error-message {
      font-size: 12px;
      padding-left: 5px;
      color: var(--color-text-softest);
    }
  }
</style>
