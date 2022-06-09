<script>
  import { _ } from 'svelte-i18n';
  import CustomButton from './../form-elements/CustomButton.svelte';
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

  const settingsList = [
    {
      titleLocaleLabel: 'intervals',
      component: IntervalSettings,
    },
    {
      titleLocaleLabel: 'language',
      component: LanguageSettings,
    },
    {
      titleLocaleLabel: 'theme',
      component: ThemeSettings,
    },
    {
      titleLocaleLabel: 'settings.general_interface',
      component: GeneralInterfaceSettings,
    },
    {
      titleLocaleLabel: 'settings.main_screen',
      component: MainScreenSettings,
    },
    {
      titleLocaleLabel: 'settings.behaviour',
      component: BehaviourSettings,
    },
    {
      titleLocaleLabel: 'settings.activity_factor',
      component: FactorSettings,
    },
    {
      titleLocaleLabel: 'settings.reset',
      component: ResetSettings,
    },
  ];

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
    {#each settingsList as { titleLocaleLabel, component }}
      <ExpandBlock
        title="{$_(titleLocaleLabel)}"
        active="{isExpand}"
      >
        <div class="setting-section">
          <svelte:component this={component} />
        </div>
      </ExpandBlock>
    {/each}
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
  }
</style>
