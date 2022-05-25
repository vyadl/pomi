<script>
  import { _, locale } from 'svelte-i18n';
  import {
    initStat,
    statTotal,
    stat,
    getDateString,
  } from './../../store/statistics.js';
  import { activityFactor } from './../../store/intervals.js';
  import { settings } from './../../store/settings.js';
  import { activities } from '../../store/activities';
  import { changeActivityTitlesForDay } from './../../store/statistics';
  import ExpandBlock from './../ExpandBlock.svelte';
  import AllDayRecords from './AllDayRecords.svelte';
  import { getHoursAndMinutesFromMinutes } from './../../utils.js';

  export let isToday = false;
  export let expanded = false;
  export let dayStatTitle = getDateString();

  let isDetailsActive = expanded;

  initStat();
  $: currentStat = $statTotal[dayStatTitle];
  $: formattedTimeWithFactor = $settings &&
    $locale &&
    currentStat?.sum?.activities &&
    getHoursAndMinutesFromMinutes(currentStat.sum.activities * $activityFactor);

  $: formattedTime = $settings &&
    $locale &&
    currentStat?.sum?.activities &&
    getHoursAndMinutesFromMinutes(currentStat.sum.activities);

  $: $activities, checkActivities(), currentStat = $statTotal[dayStatTitle];

  function checkActivities() {
    if ($stat[dayStatTitle]) {
      $stat[dayStatTitle].some(record => {
        if (
          $activities[record.activityId] &&
          record.activityTitle !== $activities[record.activityId]
        ) {
          changeActivityTitlesForDay(dayStatTitle);
        }
      });
    }
  }
</script>

<div class="day-stat">
  <div
    class="activity-sum"
    on:click="{ () => { isDetailsActive = !isDetailsActive } }"
  >
    <div>{$_(isToday ? 'done_today' : 'activity')}</div>
    <div class="activity-sum-inner">
      {#if currentStat?.sum?.activities}
      <div>
        { formattedTimeWithFactor }
      </div>
      <div class={$activityFactor ? 'pure' : ''}>
        {#if $activityFactor}
          {$_('pure_time')} -
        {/if}
        { formattedTime }
      </div>
      {:else}
        {$_('nothing_yet')}
      {/if}
    </div>
  </div>
  {#if $settings.showDetailsOnMainScreen && currentStat}
    <ExpandBlock
      title="{isToday ? '' : $_('details')}"
      bind:active="{isDetailsActive}"
      center
    >
      <div class="details">
        <div class="total">
          {#if currentStat?.global && Object.keys(currentStat.global).length}
            <div class="details-title">{$_('global_activities')}:</div>
            {#each Object.keys(currentStat.global) as activityKey}
              <div class="activity-sum in-details">
                <div>{`${activityKey}`}</div>
                <div class="activity-sum-inner">
                  <div>
                    { 
                      $locale &&
                      getHoursAndMinutesFromMinutes(
                        currentStat.global[activityKey].totalTime * $activityFactor
                      )
                    }
                  </div>
                  <div class={$activityFactor ? 'pure' : ''}>
                    {#if $activityFactor}
                      {$_('pure_time')} -
                    {/if}
                    {
                      $locale &&
                      getHoursAndMinutesFromMinutes(
                        currentStat.global[activityKey].totalTime
                      )
                    }
                  </div>
                </div>
              </div>
            {/each}
            <br />
            <div class="details-title">{$_('all_activities')}:</div>
          {/if}
          {#if currentStat?.all}
            {#each Object.keys(currentStat.all) as activityKey}
              <div class="activity-sum in-details">
                <div>{`${activityKey}`}</div>
                <div class="activity-sum-inner">
                  <div>
                    { 
                      $locale &&
                      getHoursAndMinutesFromMinutes(
                        currentStat.all[activityKey].totalTime * $activityFactor
                      )
                    }
                  </div>
                  <div class={$activityFactor ? 'pure' : ''}>
                    {#if $activityFactor}
                      {$_('pure_time')} -
                    {/if}
                    {
                      $locale &&
                      getHoursAndMinutesFromMinutes(
                        currentStat.all[activityKey].totalTime
                      )
                    }
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </div>
      <ExpandBlock
        title="{$_('all_day_records')}"
        active="{expanded}"
        small
        center
      >
        <AllDayRecords
          dayStat="{$stat[dayStatTitle]}"
          date="{dayStatTitle}"
        />
      </ExpandBlock>
    </ExpandBlock>
  {/if}
</div>

<style lang="scss">
.day-stat {
  padding: 15px 0 35px;

  .activity-sum {
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    transition: background-color .2s;
    font-size: 17px;
    color: #aaa;
    letter-spacing: 1px;
    padding: 10px 0 15px;
    &.in-details {
      cursor: default;
      font-size: 13px;
      border-bottom: 1px dashed #444;
    }
  }
  .activity-sum-inner {
    text-align: right;
  }
  .pure {
    font-size: 12px;
    color: #555;
  }
  .details-title {
    color: #888;
    font-size: 15px;
  }
  .total {
    margin-bottom: 20px;
  }
}
</style>
