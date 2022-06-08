<script>
  import { _ } from 'svelte-i18n';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomCheckbox from './../form-elements/CustomCheckbox.svelte';
</script>

<div class="general-interface-settings">
  <CustomCheckbox
    label="{$_('settings.time_title')}"
    checked="{$settings.showTimeInTitle}"
    on:change="{({ detail }) => {
      changeSetting('showTimeInTitle', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.time_favicon')}"
    checked="{$settings.showTimeInFavicon}"
    on:change="{({ detail })  => {
      changeSetting('showTimeInFavicon', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.colorful_favicon')}"
    checked="{$settings.showLastSecondsColorful}"
    on:change="{({ detail })  => {
      changeSetting('showLastSecondsColorful', detail);
    }}"
  />
  <CustomCheckbox
    label="{$_('settings.show_planned_duration')}"
    checked="{$settings.showPlannedDuration}"
    on:change="{({ detail }) => {
      changeSetting('showPlannedDuration', detail);
    }}"
  />
</div>
