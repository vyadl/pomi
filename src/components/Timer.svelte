<script>
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';
  import {
    counter,
    timerFormattedTime,
    timerTime,
  } from './../store/counter.js';
  import {
    extraCounter,
    extraCounterFormattedTime,
    timerTime as extraTimerTime,
  } from './../store/extraCounter.js';
  import {
    activeIntervals,
    currentInterval,
    initIntervals,
    stopAudio,
  } from './../store/intervals.js';
  import { stat, lastTime } from './../store/statistics.js';
  import { settings } from './../store/settings.js';
  import { currentActivityTitle } from '../store/activities.js';
  import { makeTwoDigitsCifer, getRandomColor } from './../utils.js';
  import { initActivities } from '../store/activities.js';
  import Comment from './Comment.svelte';

  const faviconEl = document.querySelector('link[rel="icon"]');
  const faviconHref = faviconEl.getAttribute('href');
  let faviconTimer;

  let isCommentActive = false;

  counter.set(0);
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
      const currentCounter = $counter
        ? $timerTime.mins > 0
          ? $timerTime.mins 
          : $timerTime.secs
        : $extraCounter
          ? $extraTimerTime.mins > 0
            ? $extraTimerTime.mins
            : $extraTimerTime.secs + 1
          : 0;


      if ((currentCifer !== currentCounter && $settings.showTimeInFavicon)
        || ($settings.showTimeInFavicon && faviconEl.getAttribute('href') === faviconHref)) {
        const currentTime = $counter ? $timerTime : $extraTimerTime + 5;
        const bgcolor =
          currentTime.mins < 1 && currentTime.secs < 10 && $settings.showLastSecondsColorful
            ? getRandomColor()
            : $counter
              ? '#000'
              : '#fff';

        currentCifer = currentCounter;

        context.clearRect(0, 0, 64, 64);
        context.fillStyle = bgcolor;
        context.fillRect(0, 0, 64, 64);
        context.fillStyle = $counter ? '#fff' : '#000';
        context.fillText(makeTwoDigitsCifer(currentCifer), 8, 48, 48);    
        faviconEl.setAttribute('href', canvas.toDataURL('image/png'));
      }

      if (!currentCounter || !$settings.showTimeInFavicon) {
        faviconEl.setAttribute('href', faviconHref);
      }

      if (!currentCounter) {
        clearInterval(faviconTimer);
      }
    }, 1000);
  }

  function startPeriod(intervalId, options) {
    isCommentActive = false;
    clearInterval(faviconTimer);
    counter.set(options.duration * 60);
    counter.start(intervalId);
    currentInterval.set(intervalId);
    initAnimateFavicon();
  }

  function finishPeriod() {
    counter.finishPeriod($currentInterval);
  }

  function resetPeriod() {
    counter.resetPeriod($currentInterval);
    stopAudio();
  }

  function addExtraTime() {
    stat.addTime($extraCounter);
    resetExtraTime();
    stopAudio();
  }

  function resetExtraTime() {
    extraCounter.finish();
    currentInterval.set('');
    stopAudio();
  }
</script>

<div class="timer">
  <div class="inner">
    <div
      class="cifers"
      class:summed="{$extraCounter}"
    >
      <div class="cifers-desc">
        {#if $counter && $settings.showCurrentPeriodAboveTimer}
          {$_('now').toLowerCase()}:
          {$_(`interval_labels.${$currentInterval}`).toLowerCase()}
          {$currentInterval === 'main' ? $currentActivityTitle : ''}
        {:else if $extraCounter}
          {$_('last')} {$_(`interval_labels.${$currentInterval}`).toLowerCase()} + {$_('extra_time')}
        {/if}
      </div>
      {#if $extraCounter}
        {makeTwoDigitsCifer(+$lastTime.duration + $extraTimerTime.mins)}
        <span class="cifers-divider">:</span>
        {makeTwoDigitsCifer($timerTime.secs + $extraTimerTime.secs)}
      {:else}
        {$timerFormattedTime.mins }
        <span class="cifers-divider">:</span>
        {$timerFormattedTime.secs}
      {/if}
    </div>
    <div class="timer-controls">
      {#if $extraCounter}
        <div class="extra-counter-wrapper" transition:fade>
          <button
            class="button control reset"
            data-title="{$_('tooltip_reset_extra')}"
            on:click="{resetExtraTime}"
          >
            {$_('reset')}
          </button>
          <div class="extra-counter-buttons">
            <button
              class="button control"
              data-title="{$_('tooltip_add_extra')}"
              on:click="{addExtraTime}"
            >
            {$_('add_time')}
            </button>
          </div>
          <div class="extra-counter">
            <div class="extra-counter-desc">
              {$_('extra_time')}
            </div>
            {$extraCounterFormattedTime.mins}:{$extraCounterFormattedTime.secs}
          </div>
        </div>
      {:else}
        <div class="counter-buttons-wrapper" transition:fade>
          <button
            class="button control reset"
            class:unactive="{!$counter}"
            data-title="{$_('tooltip_reset')}"
            on:click="{resetPeriod}"
          >
            {$_('reset')}
          </button>
          <button
            class="button control"
            class:unactive="{!$counter}"
            data-title="{
              ($settings.subtractTimeWhenFinishing
                ? $_('tooltip_add')
                : $_('tooltip_add_all'))
              + $_('tooltip_about_settings')
            }"
            on:click="{finishPeriod}"
          >
            {$_('finish_earlier')}
          </button>
        </div>
      {/if}
    </div>
    
    <div class="buttons">
      {#each $activeIntervals as [intervalId, options]}
        <div class="button-wrapper">
          <button
            class="button"
            class:active="{intervalId === $currentInterval}"
            class:blocked="{($counter || $extraCounter)}"
            data-title="{`${options.duration}${$_('minutes_short')} - ${$_('interval_labels.' + intervalId)}`}"
            on:click="{() => {
              startPeriod(intervalId, options);
            }}"
          >
            {options.title || options.duration}
          </button>
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
      color: #eee;
      font: 70px Monaco, 'Courier New', monospace;
      letter-spacing: 5px;
      display: flex;
      justify-content: center;
      transition: color 1s;
      &.summed {
        color: #222;
      }
    }
    .cifers-desc {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 50px;
      font-size: 14px;
      letter-spacing: 1px;
      color: #333;
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
      display: flex;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      min-width: 80px;
      padding: 0 15px;
    }
    .button {
      padding: 10px 15px;
      background-color: transparent;
      color: #bbb;
      opacity: .7;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      font-size: 22px;
      letter-spacing: 1px;
      transition: opacity .1s, transform .1s;
      word-wrap: break-word;
      &.control {
        color: #aaa;
        font-size: 16px;
        min-width: 100px;
        text-align: center;
      }
      &.reset {
        font-size: 11px;
        color: #777;
        text-decoration: underline;
        margin-right: 20px;
        padding-left: 0;
      }
      &.unactive {
        pointer-events: none;
        opacity: 0;
      }

      &:hover,
      &:active,
      &.active {
        opacity: 1;
        background-color: transparent;
      }
      &.blocked {
        pointer-events: none;
      }
      &.active {
        transform: scale(1.3);
      }
    }
    .timer-controls {
      position: relative;
      width: 100%;
      height: 80px;
      padding: 20px 0;
      margin-bottom: 15px;
    }
    .counter-buttons-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .extra-counter-buttons {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-right: 40px;
    }
    .extra-counter-wrapper {
      display: flex;
      justify-content: space-between;
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
      color: #aaa;
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
      color: #333;
    }
  }
</style>
