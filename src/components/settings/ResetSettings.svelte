<script>
  import { _ } from 'svelte-i18n';
  import {
    resetSettings,
    resetHistory,
    resetActivities,
    resetAll,
  } from './../../store/settings.js';
  import CustomButton from './../form-elements/CustomButton.svelte';
  import SettingDescription from './../decorative/SettingDescription.svelte';
</script>

<div class="reset-settings">
  <SettingDescription>
    {$_('settings.reset_warning')}
  </SettingDescription>
  <div class="buttons">
    <CustomButton
      on:click="{resetSettings}"
      small
      bordered
    >
      {$_('settings.reset_to_default')}
    </CustomButton>
    <CustomButton
      on:click="{resetHistory}"
      small
      bordered
    >
      {$_('settings.clear_history')}
    </CustomButton>
    <CustomButton
      on:click="{resetActivities}"
      small
      bordered
    >
      {$_('settings.remove_all_activities')}
    </CustomButton>
    <CustomButton
      on:click="{resetAll}"
      small
      bordered
    >
      {$_('settings.reset_all')}
</CustomButton>
  </div>
</div>

<style lang="scss">
  .reset-settings {
    .buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
  }
</style>
