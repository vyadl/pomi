<script>
  import { _ } from 'svelte-i18n';
  import {
    stat,
    initStat,
    statTotal,
    statArrByMonth,
  } from './../../store/statistics.js';
  import ExpandBlock from './../ExpandBlock.svelte';
  import DayStat from './DayStat.svelte';
  import DefaultButton from './../form-elements/DefaultButton.svelte';
  import TextModal from './../modals/TextModal.svelte';
  import HandleRecordModal from './../modals/HandleRecordModal.svelte';
  import { getReadableMonthYear } from './../../utils.js';

  let isAddDayActive = false;
  let isAddRecordActive = false;
  let errormessage = '';
  let currentDay = null;
  $: areRecordsExist = (dayStat) => $statTotal[dayStat.name] && $statTotal[dayStat.name].all;
  
  initStat();

  function addDay({ detail }) {
    const day = detail?.split('-').reverse().join('.');    
    const isValid = validateDay(detail, day);

    if (isValid) {
      stat.addDay(day);
      isAddDayActive = false;
    }
  }

  function validateDay(rawDate, formatDate) {
    if (!rawDate) {
      errormessage = 'This field is required';

      return false;
    }

    if ($stat[formatDate]) {
      errormessage = 'This day is exist';

      return false;
    }

    if (+new Date(rawDate) > new Date()) {
      errormessage = 'It can\'t be a day more than now';

      return false;
    }

    return true;
  }
</script>

<div class="statistics">
  {#each $statArrByMonth as month}
    <ExpandBlock
      title="{getReadableMonthYear(month.title)}"
      center
      active={$statArrByMonth.length === 1}
    >
      {#each month.list as dayStat}
        <div class="day">
          <ExpandBlock
            title="{dayStat.name.slice(0, 2)}"
            center
            big
          >
          {#if !areRecordsExist(dayStat)}
            <div class="add-record">
              <DefaultButton
                on:click="{ () => {
                  currentDay = dayStat.name;
                  isAddRecordActive = true;
                } }"
              >
                {$_('add_record')}
              </DefaultButton>
            </div>
          {/if}
            <div class="main-data">
              {#if areRecordsExist(dayStat)}
                <DayStat
                  dayStatTitle="{dayStat.name}"
                  expanded
                />
              {/if}
            </div>
          </ExpandBlock>
        </div>
      {/each}
    </ExpandBlock>
  {/each}
  <div class="add-day-wrapper">
    <DefaultButton
      on:click="{ () => {
        isAddDayActive = true;
      } }"
    >
      {$_('add_day')}
    </DefaultButton>
  </div>
  <TextModal
    active="{isAddDayActive}"
    inputType="date"
    buttontext="{$_('add_day')}"
    customclose
    on:message="{addDay}"
    on:close="{() => {
      isAddDayActive = false;
    }}"
    bind:errormessage
    title="{$_('adding_activity')}"
  />
  <HandleRecordModal
    isAdding
    active="{isAddRecordActive}"
    dayTitle="{currentDay}"
    on:close="{() => {
      isAddRecordActive = false;
    }}"
  />
</div>

<style lang="scss">
  .statistics {
    padding: 10px 0;
    .add-record {
      text-align: center;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .add-day-wrapper {
      text-align: center;
      font-size: 12px;
    }
  }
</style>
