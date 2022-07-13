<script>
  import { _ } from 'svelte-i18n';
  import TextModal from './modals/TextModal.svelte';
  import CustomButton from './form-elements/CustomButton.svelte';
  import { settings, changeSetting } from './../store/settings';
  import {
    activities,
    orderActivity,
    activitiesArr,
    currentActivityId,
    currentActivityTitle,
    addActivity,
    removeActivity,
    initActivities,
    setCurrentActivityId,
    editActivity,
  } from './../store/activities.js';
  import { askConfirmation } from '../store/confirmation.js';

  let sortedActivitiesArr = [];
  let isAddingModalActive = false;
  let isEditingModalActive = false;
  let errorMessage = '';
  initActivities();
  updateSortedActivitiesArr();

  function updateSortedActivitiesArr() {
    sortedActivitiesArr = $settings.activitySortType === 'name'
    ? $activitiesArr
    : $orderActivity.map(id => ({
        id,
        title: $activities[id]
      })
    );
  }

  function add(event) {
    const activity = addActivity(event.detail);

    if (activity) {
      setCurrentActivityId(activity.id);
      isAddingModalActive = false;
    } else {
      errorMessage = 'This activity is already exist';
    }

    updateSortedActivitiesArr();
  }

  function edit(event) {
    const activityTitle = event.detail;
    const isSameActivityNameExist =
      $activitiesArr
        .some(activity => (
          activity.title == activityTitle) && activity.id != $currentActivityId
        );

    if (activityTitle && !isSameActivityNameExist) {
      editActivity($currentActivityId, activityTitle);
      isEditingModalActive = false;
    } else {
      errorMessage = 'This activity is already exist';
    }

    updateSortedActivitiesArr();
  }

  async function remove() {
    if (await askConfirmation()) {
      removeActivity($currentActivityId);
      isEditingModalActive = false;
    };

    updateSortedActivitiesArr();
  }
  
  function handleActivityClick(activity) {
    if ($currentActivityId === activity.id) {
      isEditingModalActive = true;
    } else {
      setCurrentActivityId(activity.id);
    }

    updateSortedActivitiesArr();
  }

  function changeSort(sortType) {
    changeSetting('activitySortType', sortType, false)
    updateSortedActivitiesArr();
  }
</script>

<div
  class="activities"
  class:list="{!$settings.showActivitiesAsCloud}"
>
  <div class="{`list ${$settings.showActivitiesAsCloud ? 'cloud-view' : 'list-view'}`}">
    {#each sortedActivitiesArr as activity}
      <CustomButton
        on:click="{() => {
          handleActivityClick(activity);
        }}"
        active="{$currentActivityId === activity.id}"
      >
        {activity.title}
      </CustomButton>
    {/each}
  </div>
  <div class="footer-buttons">
    <CustomButton
      on:click="{() => {
        isAddingModalActive = true;
      }}"
    >
      +
    </CustomButton>
  </div>
  <div class="settings">
    <div class="setting-block">
      <div class="setting-title">
        { $_('sort') }
      </div>
      <div class="setting-buttons">
        <CustomButton
          active="{ $settings.activitySortType === 'last' }"
          on:click="{() => { changeSort('last') }}"
          small
        >
          {$_('last_first')}
        </CustomButton>
        <CustomButton
          active="{ $settings.activitySortType === 'name' }"
          on:click="{() => { changeSort('name') }}"
          small
        >
          {$_('abc')}
        </CustomButton>
      </div>
    </div>
    <div class="setting-block right">
      <div class="setting-title">
        { $_('view') }
      </div>
      <div class="setting-buttons">
        <CustomButton
          active="{ $settings.showActivitiesAsCloud }"
          on:click="{() => { changeSetting('showActivitiesAsCloud', true) }}"
          small
        >
          {$_('cloud')}
        </CustomButton>
        <CustomButton
          active="{ !$settings.showActivitiesAsCloud }"
          on:click="{() => { changeSetting('showActivitiesAsCloud', false) }}"
          small
        >
          {$_('list')}
        </CustomButton>
      </div>
    </div>
  </div>
</div>
<TextModal
  buttonText="{$_('add')}"
  active="{isAddingModalActive}"
  customClose
  on:message="{add}"
  on:close="{() => {
    isAddingModalActive = false;
  }}"
  bind:errorMessage
  title="{$_('adding_activity')}"
/>
<TextModal
  buttonText="{$_('edit')}"
  active="{isEditingModalActive}"
  customClose
  on:message="{edit}"
  on:close="{() => {
    isEditingModalActive = false;
  }}"
  on:secondary="{remove}"
  bind:errorMessage
  inputMessage="{$currentActivityTitle}"
  secondaryButtonText="{$_('remove')}"
  title="{$_('editing_activity')}"
/>

<style lang="scss">
  .activities {
    padding-bottom: 25px;
    .list {
      padding-top: 20px;
      margin-bottom: 15px;
      display: flex;
      &.cloud-view {
        flex-wrap: wrap;
        justify-content: center;
      }
      &.list-view {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 68px;
      }
    }
    .settings {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
    }
    .setting-block {
      &.right {
        .setting-buttons {
          justify-content: flex-end;
        }
      }
    }
    .setting-title {
      font-size: 12px;
      text-align: center;
      color: var(--color-text-softest);
      margin-bottom: 10px;
    }
    .setting-buttons {
      display: flex;
      justify-content: flex-start;
    }
    .footer-buttons {
      text-align: center;
      margin-bottom: 40px;
    }
  }
</style>
