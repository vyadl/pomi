<script>
  import { _ } from 'svelte-i18n';
  import { calculatedActivityFactor } from './../../store/intervals.js';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomCheckbox from './../form-elements/CustomCheckbox.svelte';
  import CustomInput from './../form-elements/CustomInput.svelte';
  import SettingDescription from './../decorative/SettingDescription.svelte';

  function getFactorString(factor) {
    if (!(factor % 1)) {
      return `${factor}.00`;
    } else {
      return String(factor).padEnd(4, '0');
    }
  }
</script>

<div class="factor-settings">
  <CustomCheckbox
    label="{$_('settings.use_activity_factor')}"
    checked="{$settings.useActivityFactor}"
    on:change="{({ detail }) => {
      changeSetting('useActivityFactor', detail);
    }}"
  />
  {#if $settings.useActivityFactor}
    <SettingDescription
      title="{$_('settings.current_counted_factor')}: {$calculatedActivityFactor}"
    >
      {$_('settings.basic_factor')} <br>
      {$_('settings.formula_factor_sentence')}: <br><br>
      <b>{$_('settings.formula_factor')}</b>
    </SettingDescription>
    <CustomCheckbox
      label="{$_('settings.use_custom_activity_factor')}"
      checked="{$settings.useCustomActivityFactor}"
      on:change="{({ detail }) => {
        changeSetting('useCustomActivityFactor', detail);
      }}"
    />
    {#if $settings.useCustomActivityFactor}
      <CustomInput
        type="range"
        label="{getFactorString($settings.customActivityFactor)}"
        value="{$settings.customActivityFactor}"
        optionalProps="{
          {
            min: '.1',
            max: '3',
            step: '.05',
          }
        }"
        on:input="{({ detail }) => {
          changeSetting('customActivityFactor', detail, false);
        }}"
      />
    {/if}
  {/if}
</div>
