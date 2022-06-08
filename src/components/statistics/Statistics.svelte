<script>
  import { _ } from 'svelte-i18n';
  import {
    stat,
    initStat,
    statTotal,
    statByMonth,
  } from './../../store/statistics.js';
  import DayStat from './DayStat.svelte';
  import CustomButton from './../form-elements/CustomButton.svelte';
  import TextModal from './../modals/TextModal.svelte';
  import HandleRecordModal from './../modals/HandleRecordModal.svelte';
  import TitleLine from './../decorative/TitleLine.svelte';
  import { getReadableMonthYear } from './../../utils/timeUtils.js';
import { askConfirmation } from '../../store/confirmation.js';

  let isAddDayActive = false;
  let isAddRecordActive = false;
  let errorMessage = '';
  let currentDay = null;
  let currentDateEntityTemplate = {
    title: '',
    list: [],
  };
  let currentMonth = '';
  let currentDate = {...currentDateEntityTemplate};

  $: areRecordsExist = (dayStat) => $statTotal[dayStat.title] && $statTotal[dayStat.title].all;

  initStat();

  function setMonth(month) {
    currentDate = {...currentDateEntityTemplate};
    currentMonth = month;
  }

  function setDate(date) {
    currentDate = date;
  }

  async function removeCurrentDay() {
    if (await askConfirmation()) {
      stat.removeDay(currentDate.title);
      currentDate = {...currentDateEntityTemplate};
    }
  }

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
      errorMessage = 'This field is required';

      return false;
    }

    if ($stat[formatDate]) {
      errorMessage = 'This day is exist';

      return false;
    }

    if (+new Date(rawDate) > new Date()) {
      errorMessage = 'It can\'t be a day more than now';

      return false;
    }

    return true;
  }
</script>

<div class="statistics">
  <div class="date-selection">
    <div class="months">
      <TitleLine
          wider
          bigFont
          title="{$_('month').toLowerCase()}"
        />
      <div class="selection-list">
        {#each Object.keys($statByMonth) as month}
          <div>
            <CustomButton
              alignLeft
              active="{currentMonth === month}"
              on:click={() => {setMonth(month)}}
            >
              {getReadableMonthYear(month)}
            </CustomButton>
          </div>
        {/each}
      </div>
      <div class="additional-action">
        <CustomButton
          small
          on:click="{() => { 
            isAddDayActive = true;;
          }}"
        >
          {$_('add_day')}
        </CustomButton>
      </div>
    </div>
    {#if currentMonth}
      <div class="dates">
        <TitleLine
          wider
          bigFont
          title="{$_('day').toLowerCase()}"
        />
        <div class="selection-list">
          {#each ($statByMonth[currentMonth]?.list || []) as date}
            <div>
              <CustomButton
                active="{currentDate.title === date.title}"
                on:click={() => {setDate(date)}}
              >
                { +date.title.slice(0, 2) }
              </CustomButton>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  {#if currentDate.title}
    <TitleLine
      wider
      bigFont
      title="{$_('total_activity').toLowerCase()}"
    />
    {#if !areRecordsExist(currentDate)}
      <div class="no-records-message">{$_('there_is_nothing_yet')}</div>
      <div class="add-record">
        <CustomButton
          on:click="{ () => {
            currentDay = currentDate.title;
            isAddRecordActive = true;
          } }"
        >
          {$_('add_record')}
        </CustomButton>
      </div>
    {/if}
    {#if areRecordsExist(currentDate)}
    <div class="main-data">
      <DayStat
        dayStatTitle="{currentDate.title}"
        expanded
      />
    </div>
    {/if}
    <div class="additional-action">
      <CustomButton
        small
        on:click={removeCurrentDay}
      >
        { $_('remove_day') }
      </CustomButton>
    </div>
  {/if}
  <TextModal
    active="{isAddDayActive}"
    inputType="date"
    buttonText="{$_('add')}"
    customClose
    on:message="{addDay}"
    on:close="{() => {
      isAddDayActive = false;
    }}"
    bind:errorMessage
    title="{$_('add_day')}"
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
    position: relative;
    .add-record {
      text-align: center;
      font-size: 14px;
      padding-bottom: 15px;
    }
    .additional-action {
      text-align: right;
      font-size: 12px;
      padding: 5px;
      border: 2px solid var(--color-border-hard);
      border-right: none;
      border-bottom: none;
      border-radius: 20px 0;
      position: absolute;
      right: -15px;
      bottom: 0;
    }
    .selection-list {
      padding-top: 15px;
      display: flex;
      flex-wrap: wrap;
    }
    .months {
      padding-bottom: 30px;
      .selection-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }
    }
    .dates {
      position: relative;
      padding-bottom: 15px;
      .selection-list {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
      }
    }
    .no-records-message {
      padding: 35px 10px;
      font-size: 16px;
      text-align: center;
      color: var(--color-text-softest-2);
    }
    .date-selection {
      position: relative;
      padding-top: 20px;
      padding-bottom: 45px;
    }
  }
</style>
