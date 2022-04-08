<script>
  export let buttontext;
  export let title;
  export let inputmessage;
  export let errormessage;
  export let active = false;
  export let customclose = false;
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import DefaultButton from './DefaultButton.svelte';
  import TextInput from './TextInput.svelte';
  import BasicModal from './BasicModal.svelte';

  const dispatch = createEventDispatcher();
  let value = '';

  $: if (!active) closeModal();

  function sendValue() {
    dispatch('message', value);
    if (!customclose) {
      closeModal();
    }
  }

  function closeModal() {
    dispatch('close');
    value = '';
    errormessage = ''; 
  }
</script>

<BasicModal bind:active on:close="{closeModal}">
  <div class="inner">
    {#if title}
      <div class="title">{title}</div>
    {/if}
    <slot>
      <form class="form" on:submit|preventDefault="{sendValue}">
        <div class="input-wrapper">
          <TextInput
            bind:value
            autofocus
            wide
            bind:errormessage
          />
        </div>
        <div class="buttons">
          <DefaultButton type="submit">{buttontext}</DefaultButton>
        </div>
      </form>
    </slot>
  </div>
</BasicModal>

<style lang="scss">
  .title {
    font-size: 18px;
    color: #eee;
    margin-bottom: 30px;
    text-align: center;
  }

  .inner {
    padding: 15px;
    width: 300px;
    max-width: 100vw;
    margin: 0 auto;
  }

  .input-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .buttons {
    display: flex;
    justify-content: space-around;
  }
</style>
