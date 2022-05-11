<script>
  export let buttontext;
  export let title;
  export let inputmessage;
  export let errormessage;
  export let active = false;
  export let customclose = false;
  import { createEventDispatcher } from 'svelte';
  import DefaultButton from './../form-elements/DefaultButton.svelte';
  import TextInput from './../form-elements/TextInput.svelte';
  import BasicModal from './../modals/BasicModal.svelte';

  const dispatch = createEventDispatcher();
  let value = '';

  $: if (inputmessage && active) { value = inputmessage; };

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

<BasicModal
  bind:active
  on:close="{closeModal}"
  title="{title}"
>
  <div class="inner">
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
  .inner {
    padding: 15px;
    width: 300px;
    max-width: 100vw;
    margin: 0 auto;
  }

  .input-wrapper {
    margin-bottom: 20px;
  }

  .buttons {
    display: flex;
    justify-content: space-around;
  }
</style>
