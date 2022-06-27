<script>
  import { createEventDispatcher } from 'svelte';
  import CustomButton from './../form-elements/CustomButton.svelte';
  import CustomInput from './../form-elements/CustomInput.svelte';
  import BasicModal from './../modals/BasicModal.svelte';

  export let active = false;
  export let customClose = false;
  export let wide = true;
  export let buttonText = '';
  export let title = '';
  export let inputMessage = '';
  export let errorMessage = '';
  export let inputType = 'text';
  export let secondaryButtonText = '';

  const dispatch = createEventDispatcher();
  let value = '';

  $: if (inputMessage && active) { value = inputMessage; };

  $: if (!active) closeModal();

  function sendValue() {
    dispatch('message', value);

    if (!customClose) {
      closeModal();
    }
  }

  function closeModal() {
    dispatch('close');
    value = '';
    errorMessage = ''; 
  }
</script>

<BasicModal
  bind:active
  on:close="{closeModal}"
  title="{title}"
>
  <div class="text-modal">
    <form class="form" on:submit|preventDefault="{sendValue}">
      <div class="input-wrapper">
        <CustomInput
          type="{inputType}"
          bind:value
          autofocus
          wide="{wide}"
          bind:errorMessage
        />
      </div>
      <div
        class="buttons"
        class:double="{secondaryButtonText}"
      >
        {#if secondaryButtonText}
          <CustomButton
            small
            on:click="{() => { dispatch('secondary') }}"
          >
            {secondaryButtonText}
          </CustomButton>
        {/if}
        <CustomButton
          bordered="{secondaryButtonText}"
          type="submit"
        >
          {buttonText}
        </CustomButton>
      </div>
    </form>
  </div>
</BasicModal>

<style lang="scss">
  .text-modal {
    padding: 15px;
    width: 300px;
    max-width: 100vw;
    margin: 0 auto;
    .input-wrapper {
      margin-bottom: 20px;
    }

    .buttons {
      display: flex;
      justify-content: space-around;
      &.double {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
    }
  }
</style>
