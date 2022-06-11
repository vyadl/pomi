<script>
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';
  import {
    counter,
    counterFormattedTime,
    timer,
    timerFormattedTime,
    extraTimer,
    extraTimerFormattedTime
  } from './../store/counter.js';
  import {
    activeIntervals,
    currentInterval,
    initIntervals,
    stopAudio,
  } from './../store/intervals.js';
  import { stat } from './../store/statistics.js';
  import { settings } from './../store/settings.js';
  import { currentActivityTitle } from '../store/activities.js';
  import { makeTwoDigitsCifer, getRandomColor } from './../utils/generalUtils.js';
  import { initActivities } from '../store/activities.js';
  import CustomButton from './form-elements/CustomButton.svelte';
  import Comment from './Comment.svelte';

  const faviconEl = document.querySelector('link[rel="icon"]');
  const faviconHref = faviconEl.getAttribute('href');
  let faviconTimer;

  let isCommentActive = false;

  initActivities();
  initIntervals();
  initAnimateFavicon();

  function initAnimateFavicon() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let currentCifer = 0;

    canvas.height = canvas.width = 64;
    context.font = '42px Monaco, Courier, monospace';
    context.fillStyle = '#fff';

    faviconTimer = setInterval(() => {
      const currentCounter = $timer > 0
        ? +$timerFormattedTime.mins > 0
          ? $timerFormattedTime.mins
          : $timerFormattedTime.secs
        : $extraTimer
          ? +$extraTimerFormattedTime.mins > 0
            ? $extraTimerFormattedTime.mins
            : $extraTimerFormattedTime.secs
          : 0;

      if ((currentCifer !== currentCounter && $settings.showTimeInFavicon)
        || ($settings.showTimeInFavicon && faviconEl.getAttribute('href') === faviconHref)) {
        const currentTime = $timer > 0 ? $timerFormattedTime : $extraTimerFormattedTime + 5;
        const bgcolor =
          currentTime.mins < 1 && currentTime.secs < 10 && $settings.showLastSecondsColorful
            ? getRandomColor()
            : $extraTimer
              ? '#fff'
              : '#000';

        currentCifer = currentCounter;

        context.clearRect(0, 0, 64, 64);
        context.fillStyle = bgcolor;
        context.fillRect(0, 0, 64, 64);
        context.fillStyle = $extraTimer ? '#000' : '#fff';
        context.fillText(makeTwoDigitsCifer(currentCifer), 8, 48, 48);    
        faviconEl.setAttribute('href', canvas.toDataURL('image/png'));
      }

      if (!currentCounter || !$settings.showTimeInFavicon) {
        faviconEl.setAttribute('href', faviconHref);
      }

      if (!$counter) {
        clearInterval(faviconTimer);
      }
    }, 1000);
  }

  function startPeriod(intervalId, options) {
    isCommentActive = false;
    clearInterval(faviconTimer);
    counter.start(intervalId, options.duration * 60);
    currentInterval.set(intervalId);
    initAnimateFavicon();
  }

  function finishPeriod() {
    counter.finishPeriod($currentInterval);
  }

  function resetPeriod() {
    counter.resetPeriod();
    stopAudio();
  }

  function addExtraTime() {
    stat.addTime();
    resetPeriod();
    stopAudio();
  }
</script>

<div class="timer">
  <div class="inner">
    <div
      class="cifers"
      class:summed="{$extraTimer}"
    >
      <div class="cifers-desc">
        {#if $counter || $timer && $settings.showCurrentPeriodAboveTimer}
          {$_('now').toLowerCase()}:
          {$_(`interval_labels.${$currentInterval}`).toLowerCase()}
          {$currentInterval === 'main' ? $currentActivityTitle : ''}
        {:else if $extraTimer}
          {$_('last')} {$_(`interval_labels.${$currentInterval}`).toLowerCase()} + {$_('extra_time')}
        {/if}
      </div>
      {#if $extraTimer}
        {$counterFormattedTime.mins}
        <span class="cifers-divider">:</span>
        {$counterFormattedTime.secs}
      {:else}
        {$timerFormattedTime.mins }
        <span class="cifers-divider">:</span>
        {$timerFormattedTime.secs}
      {/if}
    </div>
    <div class="timer-controls">
      {#if $extraTimer}
        <div class="extra-counter-wrapper" transition:fade>
          <div class="extra-counter-buttons">
            <CustomButton
              underline
              dimmed
              small
              onlyText
              title="{$_('tooltip_reset_extra')}"
              on:click="{resetPeriod}"
            >
              {$_('reset')}
            </CustomButton>
            <CustomButton
              onlyText
              big
              title="{$_('tooltip_add_extra')}"
              on:click="{addExtraTime}"
            >
              {$_('add_time')}
            </CustomButton>
          </div>
          <div class="extra-counter">
            <div class="extra-counter-desc">
              {$_('extra_time')}
            </div>
            {$extraTimerFormattedTime.mins}:{$extraTimerFormattedTime.secs}
          </div>
        </div>
      {:else if ($timer > 0)}
        <div
          class="counter-buttons-wrapper"
          transition:fade
        >
          <CustomButton
            underline
            dimmed
            small
            onlyText
            title="{$_('tooltip_reset')}"
            on:click="{resetPeriod}"
          >
            {$_('reset')}
          </CustomButton>
          <CustomButton
            onlyText
            big
            title="{$_('tooltip_add')}"
            on:click="{finishPeriod}"
          >
            {$_('finish_earlier')}
          </CustomButton>
        </div>
      {/if}
    </div>
    
    <div class="buttons">
      {#each $activeIntervals as [intervalId, options]}
        <div class="button-wrapper">
          <CustomButton
            onlyText
            big
            activeBigger
            active="{intervalId === $currentInterval}"
            disabled="{($counter || $timer)}"
            title="{`${options.duration}${$_('minutes_short')} - ${$_('interval_labels.' + intervalId)}`}"
            on:click="{() => {
              startPeriod(intervalId, options);
            }}"
          >
            {options.title || options.duration}
          </CustomButton>
          {#if $settings.showDescriptionsForPeriods}
            <div
              class="period-description"
              title="{$_('tooltips.period_description')}"
            >
              {$_(`interval_labels.${intervalId}`)}
            </div>
          {/if}
        </div>
      {/each}
    </div>
    {#if $settings.showComment}
      <Comment
        active="{isCommentActive}"
        visible="{$currentInterval}"
        on:switch="{() => {
          isCommentActive = !isCommentActive;
        }}"
      />
    {/if}
  </div>
</div>

<style lang="scss">
  .timer {
    display: flex;
    .inner {
      padding: 90px 10px 40px;
      margin: auto;
      width: 100%;
    }
    .cifers {
      color: var(--color-text);
      font: 70px Monaco, 'Courier New', monospace;
      letter-spacing: 5px;
      display: flex;
      justify-content: center;
      transition: color 1s;
      &.summed {
        color: var(--color-text-softest-2);
      }
    }
    .cifers-desc {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 50px;
      font-size: 14px;
      letter-spacing: 1px;
      color: var(--color-text-softest);
    }
    .cifers-divider {
      position: relative;
      top: -6px;
    }
    .buttons {
      position: relative;
      display: flex;
      justify-content: center;
      min-height: 90px;
    }
    .button-wrapper {
      position: relative;
      display: flex;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      min-width: 80px;
      padding: 0 15px;
    }
    .timer-controls {
      position: relative;
      width: 100%;
      height: 80px;
      padding: 20px 0;
      margin-bottom: 30px;
    }
    .counter-buttons-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      gap: 20px;
      width: 100%;
      height: 100%;
    }
    .extra-counter-buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 40px;
      gap: 20px;
    }
    .extra-counter-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .extra-counter {
      position: relative;
      font-size: 22px;
      width: 80px;
      text-align: right;
      color: var(--color-text-soft);
    }
    .extra-counter-desc {
      position: absolute;
      top: -15px;
      width: 200%;
      right: 0;
      text-align: right;
      font-size: 12px;
      letter-spacing: 1px;
      margin-bottom: 5px;
      color: var(--color-text-softest-2);
    }
    .period-description {
      position: absolute;
      font-size: 12px;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      color: var(--color-text-softest-2);
    }
  }
</style>
