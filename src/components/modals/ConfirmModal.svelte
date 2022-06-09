<script>
  import CustomButton from './../form-elements/CustomButton.svelte';
  import BasicModal from './../modals/BasicModal.svelte';
  import { confirmStore, confirm, reject } from './../../store/confirmation.js';

</script>

<BasicModal
  active="{$confirmStore.active}"
  on:close="{reject}"
  title="{$confirmStore.title}"
>
  <div class="confirm-modal">
    <div class="inner">
      {#if $confirmStore.body}
        <div class="body">
          {$confirmStore.body}
        </div>
      {/if}
      <div class="buttons">
        <CustomButton on:click="{confirm}">
          {$confirmStore.confirmText}
        </CustomButton>
        <CustomButton on:click="{reject}">
          {$confirmStore.rejectText}
        </CustomButton>
      </div>
    </div>
  </div>
</BasicModal>

<style lang="scss">
  .confirm-modal {
    .inner {
      padding: 15px;
      width: 300px;
      max-width: 100vw;
      margin: 0 auto;
    }
    .body {
      color: var(--color-text-soft);
      padding: 15px 0 25px;
    }
    .buttons {
      display: flex;
      justify-content: space-around;
    }
  }
</style>
