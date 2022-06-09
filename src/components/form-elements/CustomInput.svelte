<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let value;
  export let wide = false;
  export let autofocus = false;
  export let readonly = false;
  export let required = false;
  export let big = false;
  export let center = false;
  export let pure = false;
  export let central = false;
  export let label = '';
  export let errorMessage = '';
  export let type = 'text';
  export let optionalProps = {};

  let inputEl;

  onMount(() => {
    if (autofocus) {
      inputEl.focus();
    }
  });

  const dispatch = createEventDispatcher();

  function onInput() {
    errorMessage = '';
    dispatch('input', value);
  }
  function onChange() {
    errorMessage = '';
    dispatch('change', value);
  }
</script>
<div
  class="custom-input"
  class:wide
  class:pure
  class:central
  class:big
  class:center
  class:range="{type === 'range'}"
>
  <label class="label">
    {#if label}
      <div class="label-text">{label}{required ? '*' : ''}</div>
    {/if}
    {#if type === 'text'}
      <input
        type="text"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onInput}
        on:change={onChange}
        bind:this={inputEl}
        {...optionalProps}
      />
    {/if}
    {#if type === 'number'}
      <input
        type="number"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onInput}
        on:change={onChange}
        bind:this={inputEl}
        {...optionalProps}
      />
    {/if}
    {#if type === 'time'}
      <input
        type="time"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onInput}
        on:change={onChange}
        bind:this={inputEl}
        {...optionalProps}
      />
    {/if}
    {#if type === 'date'}
      <input
        type="date"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onInput}
        on:change={onChange}
        bind:this={inputEl}
        {...optionalProps}
      />
    {/if}
    {#if type === 'range'}
      <input
        type="range"
        class="input"
        readonly="{readonly}"
        required="{required}"
        bind:value
        on:input={onInput}
        on:change={onChange}
        bind:this={inputEl}
        {...optionalProps}
      />
    {/if}
  </label>
  {#if errorMessage}
    <div class="error-message">{errorMessage}</div>
  {/if}
</div>

<style lang="scss">
  .custom-input {
    padding: 5px 0 10px;
    &.wide {
      .input {
        width: 100%;
      }
    }
    &.big {
      .input {
       font-size: 22px;
      }
    }
    &.center {
      .input {
        text-align: center;
      }
    }
    &.pure {
      .input {
        padding-left: 0;
        border: none;
      }
    }
    &.central {
      text-align: center;
      .input {
        text-align: center;
      }
    }
    &.range {
      .input {
        height: 0;
        width: 100%;
        -webkit-appearance: none;
        outline: none;
        background: transparent;
        border: none;
        padding: 0;
        &::-webkit-slider-runnable-track {
          width: 100%;
          height: 5px;
          cursor: pointer;
          box-shadow: 0px 0px 0px #999;
          background-color: var(--color-main-bg-softest);
          border-radius: 1px;
          border: 0px solid #999;
          transition: background-color .2s;
        }
        &::-webkit-slider-thumb {
          box-shadow: 0px 0px 0px #000;
          border: 0px solid #000;
          height: 15px;
          width: 15px;
          border-radius: 15px;
          background: #555;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -5px;
        }
        &:focus {
          &::-webkit-slider-runnable-track {
            background-color: var(--color-text-soft);
          }
        }
      }
    }
    .label {
      display: block;
    }
    .label-text {
      display: block;
      margin-bottom: 7px;
      font-size: 12px;
      color: var(--color-text-softest);
    }
    .input {
      background: none;
      border: none;
      border-bottom: 2px solid var(--color-main-bg-softest);
      border-radius: 0;
      transition: border-color .2s;
      color: var(--color-text-soft);
      font-size: 14px;
      padding: 5px;
      &:focus {
        outline: none;
        &:not(:read-only) {
          border-bottom-color: var(--color-text-softer);
        }
      }
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    .error-message {
      font-size: 12px;
      padding-left: 5px;
      color: var(--color-text-softer);
    }
  }
</style>
