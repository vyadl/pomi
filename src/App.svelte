<script>
  import { init, addMessages, _ } from 'svelte-i18n';
  import en from './locale/en.json';
  import ru from './locale/ru.json';
  import ua from './locale/ua.json';
  import Timer from './components/Timer.svelte';
  import Settings from './components/Settings.svelte';
  import { initSettings, settings } from './store/settings';
  import { counter, timerFormattedTime } from './store/counter.js';
  import { extraCounter, extraCounterFormattedTime } from './store/extraCounter.js';
  import { currentTag } from './store/tags.js';
  import DayStat from './components/statistics/DayStat.svelte';
  import Tabs from './components/Tabs.svelte';

  initSettings();

  addMessages('en', en);
  addMessages('ru', ru);
  addMessages('ua', ua);

  init({
    fallbackLocale: 'en',
    initialLocale: $settings.language,
  });

  let activeSettings = false;
</script>

<svelte:head>
  <title>
    {$counter || $extraCounter && $settings.showTimeInTitle
      ? $counter
        ? `${$timerFormattedTime.mins}:${$timerFormattedTime.secs}`
        : `${$extraCounterFormattedTime.mins}:${$extraCounterFormattedTime.secs}`
      : 'pomi'}
  </title>
</svelte:head>
<main class="wrapper">
  <section class="top-line">
    <div class="title"></div>
    <div class="current-tag">
      {$_('activity')}: {$currentTag.title}
    </div>
  </section>
  <section
    class="settings"
    on:click="{() => {
      activeSettings = true;
    }}"
  >
    {$_('settings.title')}
  </section>
  <section class="central-wrapper">
    <Timer />
    {#if $settings.showActivityNearTimer}
      <DayStat isToday />
    {/if}
    <Tabs />
  </section>
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

  .central-wrapper {
    width: 450px;
    margin: 0 auto;
    padding-bottom: 100px;
  }

  .settings {
    position: fixed;
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
