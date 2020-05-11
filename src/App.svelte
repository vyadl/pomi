<script>
  import { init, addMessages, _ } from 'svelte-i18n';
  import en from './locale/en.json';
  import ru from './locale/ru.json';
  import Timer from './components/Timer.svelte';
  import Settings from './components/Settings.svelte';
  import { initSettings, settings } from './store/settings';
  import { counter, timerFormattedTime } from './store/counter.js';
  import { currentTag } from './store/tags.js';
  export let name;

  initSettings();

  addMessages('en', en);
  addMessages('ru', ru);

  init({
    fallbackLocale: 'en',
    initialLocale: $settings.language,
  });

  let activeSettings = false;
</script>

<svelte:head>
  <title>
    {$counter && $settings.showTimeInTitle
      ? `${$timerFormattedTime.mins}:${$timerFormattedTime.secs}`
      : 'pomi'}
  </title>
</svelte:head>
<main class="wrapper">
  <div class="top-line">
    <div class="title"></div>
    <div class="current-tag">
      {$_('activity')}: {Object.values($currentTag)[0]}
    </div>
  </div>
  <div
    class="settings"
    on:click="{() => {
      activeSettings = true;
    }}"
  >
    {$_('settings.title')}
  </div>
  <Timer />
  <Settings
    active="{activeSettings}"
    on:close="{() => {
      activeSettings = false;
    }}"
  />
</main>

<style lang="scss">
  .wrapper {
    position: relative;
    background-color: #111;
    min-width: 100vw;
    min-height: 100vh;
    padding: 0;
    margin: 0;
  }
  .top-line {
    padding: 15px;
    color: #333;
    font: 12px Verdana, sans-serif;
    letter-spacing: 2px;
    display: flex;
    justify-content: space-between;
  }
  .current-tag,
  .settings {
    color: #666;
    font: 12px Verdana, sans-serif;
    letter-spacing: 2px;
  }

  .settings {
    position: absolute;
    bottom: 15px;
    right: 15px;
    opacity: 0.8;
    transition: opacity 0.2s;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
</style>
