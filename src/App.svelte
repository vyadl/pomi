<script>
  import { init, addMessages, _ } from 'svelte-i18n';
  import en from './locale/en.json';
  import ru from './locale/ru.json';
  import ua from './locale/ua.json';
  import CustomSelect from './components/form-elements/CustomSelect.svelte';
  import Timer from './components/Timer.svelte';
  import Settings from './components/settings/Settings.svelte';
  import { initSettings, settings } from './store/settings';
  import {
    counter,
    timerFormattedTime,
    timer,
    extraTimer,
    extraTimerFormattedTime,
  } from './store/counter.js';
  import {
    setCurrentActivityId,
    activityOptionsForSelect,
    currentActivityId
  } from './store/activities.js';
  import DayStat from './components/statistics/DayStat.svelte';
  import Tabs from './components/Tabs.svelte';
  import Activities from './components/Activities.svelte';
  import Statistics from './components/statistics/Statistics.svelte';
  import Messages from './components/Messages.svelte';
  import ConfirmModal from './components/modals/ConfirmModal.svelte';

  initSettings();

  document.body.classList.add($settings.theme);
  addMessages('en', en);
  addMessages('ua', ua);
  addMessages('ru', ru);

  init({
    fallbackLocale: 'en',
    initialLocale: $settings.language,
  });

  let activeSettings = false;

  let mainTabs = [
    {
      id: 'activities',
      titleLocaleLabel: 'activities',
      component: Activities,
    },
    {
      id: 'statistics',
      titleLocaleLabel: 'history',
      component: Statistics,
    },
  ];
</script>

<svelte:head>
  <title>
    {
      $counter && $settings.showTimeInTitle
      ? $extraTimer
        ? $extraTimerFormattedTime
        : $timerFormattedTime
      : 'pomi'
    }
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
      <CustomSelect
        pure
        noMargin
        right
        options="{$activityOptionsForSelect}"
        value={$currentActivityId}
        fontInherit
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
      <div class="day-stat-wrapper">
        <DayStat isToday />
      </div>
    {/if}
    {#if $settings.showMainTabs}
      <div class="day-stat-wrapper">
        <Tabs tabs="{mainTabs}" />
      </div>
    {/if}
  </section>
  <Settings
    active="{activeSettings}"
    on:close="{() => {
      activeSettings = false;
    }}"
  />
  <Messages />
  <ConfirmModal />
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
  .day-stat-wrapper {
    margin-bottom: 50px;
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
