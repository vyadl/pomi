<script>
  import { _, locale, locales } from 'svelte-i18n';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomButton from './../form-elements/CustomButton.svelte';

  function changeLanguage(lang) {
    changeSetting('language', lang);
    locale.set(lang);
  }
</script>

<div class="language-settings">
  <div class="languages">
    <div class="language-buttons">
      {#each $locales as lang}
        <CustomButton
          on:click="{() => {
            changeLanguage(lang);
          }}"
          active="{$settings.language === lang}"
        >
          {$_(`languages.${lang}`)}
        </CustomButton>
      {/each}
    </div>
  </div>
</div>
