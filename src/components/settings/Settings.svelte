<script>
  import { _, locale, locales } from 'svelte-i18n';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomButton from './../form-elements/CustomButton.svelte';
  import CustomCheckbox from './../form-elements/CustomCheckbox.svelte';
  import BasicModal from './../modals/BasicModal.svelte';
  import ExpandBlock from './../ExpandBlock.svelte';
  import IntervalSettings from './IntervalSettings.svelte';
  import ResetSettings from './ResetSettings.svelte';
  import FactorSettings from './FactorSettings.svelte';
  import LanguageSettings from './LanguageSettings.svelte';
  import ThemeSettings from './ThemeSettings.svelte';
  import BehaviourSettings from './BehaviourSettings.svelte';
  import GeneralInterfaceSettings from './GeneralInterfaceSettings.svelte';
  import MainScreenSettings from './MainScreenSettings.svelte';
  
  export let active = false;
  let isExpand = false;

</script>

<BasicModal bind:active on:close>
  <div class="settings">
    <div class="actions">
      <CustomButton
        small
        on:click="{() => { isExpand = !isExpand }}"
      >
        {isExpand ? $_('settings.hide_all') : $_('settings.expand_all')}
      </CustomButton>
    </div>
    
    <ExpandBlock
      title="{$_('intervals')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <IntervalSettings />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('language')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <LanguageSettings />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('theme')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <ThemeSettings />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.general_interface')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <GeneralInterfaceSettings />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.main_screen')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <MainScreenSettings />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.behaviour')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <BehaviourSettings />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.activity_factor')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <FactorSettings />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.reset')}"
      active="{isExpand}"
    >
      <div class="setting-section">
        <ResetSettings />
      </div>
    </ExpandBlock>
  </div>
</BasicModal>

<style lang="scss">
  .settings {
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
    padding: 0 10px;
    color: var(--color-text-soft);
    .setting-section {
      padding-bottom: 25px;
    }
    .actions {
      text-align: right;
      margin-bottom: 20px;
    }
    .languages {
      padding: 30px 0;
    }
    .setting-description {
      padding-top: 10px;
      padding-left: 15px;
      font-size: 13px;
      color: var(--color-text-soft);
    }
    .checkbox-setting {
      padding: 7px 0;
      &.nested {
        margin-left: 15px;
      }
    }
  }
</style>
