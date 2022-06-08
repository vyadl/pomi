<script>
  import { _ } from 'svelte-i18n';
  import { settings, changeSetting } from './../../store/settings.js';
  import CustomButton from './../form-elements/CustomButton.svelte';

  let themes = ['dark', 'light'];

  function changeTheme(theme) {
    changeSetting('theme', theme);

    document.body.className = '';
    document.body.classList.add(theme);
  }
</script>

<div class="theme-settings">
  <div class="themes">
    <div class="theme-buttons">
      {#each themes as theme}
        <CustomButton
          on:click="{() => {
            changeTheme(theme);
          }}"
          active="{$settings.theme === theme}"
        >
          {$_(`themes.${theme}`)}
        </CustomButton>
      {/each}
    </div>
  </div>
</div>
