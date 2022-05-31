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
  import TitleLine from './../decorative/TitleLine.svelte';
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

<div
  class="day-stat"
  class:is-today="{isToday}"
>
  <div
    class="activity-sum"
    title="{$_('click_for_details')}"
    on:click="{ () => { isDetailsActive = isToday ? !isDetailsActive : true } }"
  >
    <div class="activity-sum-inner">
      {#if currentStat?.sum?.activities}
        {#if $settings.useActivityFactor}
          <div class="factor-time" >
            { formattedTimeWithFactor }
          </div>
        {/if}
        <div class:pure-time={$activityFactor}>
          {#if $settings.useActivityFactor}
            {$_('pure_time')} -
          {/if}
          { formattedTime }
        </div>
      {:else}
        {$_('nothing_yet')}
      {/if}
    </div>
  </div>
  {#if currentStat}
    <ExpandBlock
      title="{isToday ? '' : $_('details').toLowerCase() }"
      noLine="{isToday}"
      fixedOpen="{!isToday}"
      bind:active="{isDetailsActive}"
      wider
    >
      <div class="details">
        <div class="total">
          {#if currentStat?.global && Object.keys(currentStat.global).length}
            <TitleLine
              bigFont="{isToday}"
              wider="{!isToday}"
              title="{$_('global_activities').toLowerCase()}"
            />
            {#each Object.keys(currentStat.global) as activityKey}
              <div class="activity-sum in-details">
                <div>{`${activityKey}`}</div>
                <div class="activity-sum-inner">
                  {#if $settings.useActivityFactor}
                    <div>
                      { 
                        $locale &&
                        getHoursAndMinutesFromMinutes(
                          currentStat.global[activityKey].totalTime * $activityFactor
                        )
                      }
                    </div>
                  {/if}
                  <div class:pure={$settings.useActivityFactor}>
                    {#if $settings.useActivityFactor}
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
            <TitleLine
              bigFont="{isToday}"
              wider="{!isToday}"
              title="{$_('all_activities').toLowerCase()}"
            />
          {/if}
          {#if currentStat?.all}
            {#each Object.keys(currentStat.all) as activityKey}
              <div class="activity-sum in-details">
                <div>{`${activityKey}`}</div>
                <div class="activity-sum-inner">
                  {#if $settings.useActivityFactor}
                    <div>
                      { 
                        $locale &&
                        getHoursAndMinutesFromMinutes(
                          currentStat.all[activityKey].totalTime * $activityFactor
                        )
                      }
                    </div>
                  {/if}
                  <div class:pure="{$settings.useActivityFactor}">
                    {#if $settings.useActivityFactor}
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
        fixedOpen="{!isToday}"
        wider="{!isToday}"
      >
        <AllDayRecords
          dayStat="{$stat[dayStatTitle]}"
          isToday
          date="{dayStatTitle}"
        />
      </ExpandBlock>
    </ExpandBlock>
  {/if}
</div>

<style lang="scss">
.day-stat {
  padding: 15px 0 35px;

  &.is-today {
    .activity-sum {
      opacity: .8;
      transition: opacity .2s;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }

  .activity-sum {
    justify-content: space-between;
    transition: background-color .2s;
    font-size: 22px;
    color: var(--color-text);
    letter-spacing: 1px;
    padding: 15px 0 50px;
    
    &.in-details {
      display: flex;
      cursor: default;
      font-size: 13px;
      border: 2px solid var(--color-main-bg-softest);
      padding: 10px;
      align-items: center;
      border-radius: 5px;
      margin-bottom: 10px;
      background-color: var(--color-main-bg-soft);

      .activity-sum-inner {
        text-align: right;
        font-size: 14px;
      }

      .pure {
        font-size: 11px;
      }
    }
  }
  .activity-sum-inner {
    text-align: center;
  }
  .factor-time {
    margin-bottom: 20px;
  }
  .pure-time {
    font-size: 12px;
    color: var(--color-text-soft);
  }
  .details-title {
    color: var(--color-text);
    font-size: 15px;
    margin-bottom: 10px;
  }
  .total {
    margin-bottom: 20px;
  }
}
</style>
