<script>
  import { init, addMessages, _ } from 'svelte-i18n';
  import en from './locale/en.json';
  import ru from './locale/ru.json';
  import ua from './locale/ua.json';
  import DefaultSelect from './components/form-elements/DefaultSelect.svelte';
  import Timer from './components/Timer.svelte';
  import Settings from './components/Settings.svelte';
  import { initSettings, settings } from './store/settings';
  import { counter, timerFormattedTime } from './store/counter.js';
  import { extraCounter, extraCounterFormattedTime } from './store/extraCounter.js';
  import { setCurrentActivityId, activityOptionsForSelect, currentActivityId } from './store/activities.js';
  import DayStat from './components/statistics/DayStat.svelte';
  import Tabs from './components/Tabs.svelte';
  import Messages from './components/Messages.svelte';

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
  {#if $settings.showCurrentActivityOnMainScreen}
    <div class="current-activity">
      {#if $settings.showCurrentActivityLabelOnMainScreen}
        <div class="current-activity-label">
          {$_('current_activity').toLowerCase()}
        </div>
      {/if}
      <DefaultSelect
        pure
        nomargin
        right
        options="{$activityOptionsForSelect}"
        value={$currentActivityId}
        fontinherit
        on:change="{event => {
          setCurrentActivityId(event.detail);
        }}"
      />
    </div>
  {/if}
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
    {#if $settings.showMainTabs}
      <Tabs />
    {/if}
  </section>
  <Settings
    active="{activeSettings}"
    on:close="{() => {
      activeSettings = false;
    }}"
  />
  <Messages />
</main>

<style lang="scss">
  .wrapper {
    position: relative;
    background-color: var(--color-main-bg);
    min-width: 100vw;
    min-height: 100vh;
    padding: 0;
    margin: 0;
  }

  .current-activity,
  .settings {
    color: var(--color-text-softest);
    font: 13px Verdana, sans-serif;
    letter-spacing: 2px;
  }

  .current-activity {
    position: absolute;
    top: 15px;
    right: 15px;
    text-align: right;
  }

  .current-activity-label {
    font-size: 10px;
    padding-right: 5px;
  }

  .central-wrapper {
    width: 450px;
    margin: 0 auto;
    padding-bottom: 100px;
  }

  .settings {
    position: fixed;
    bottom: 20px;
    right: 20px;
    opacity: .8;
    transition: opacity .2s;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
  }
</style>
