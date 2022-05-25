<script>
  import { _, locale, locales } from 'svelte-i18n';
  import {
    intervals,
    intervalsArr,
    playAudio,
    calculatedActivityFactor,
    updateFactor,
  } from './../store/intervals.js';
  import { soundsArr } from './../store/sounds.js';
  import {
    settings,
    resetSettings,
    resetHistory,
    resetActivities,
    resetAll,
  } from './../store/settings.js';
  import DefaultButton from './form-elements/DefaultButton.svelte';
  import DefaultCheckbox from './form-elements/DefaultCheckbox.svelte';
  import BasicModal from './modals/BasicModal.svelte';
  import ExpandBlock from './ExpandBlock.svelte';

  export let active = false;
  let isExpand = false;

  let localSettings = JSON.parse(JSON.stringify($settings));
  let showNotificationWarning = false;

  function changeSetting(setting, value) {
    settings.update(settings => {
      settings[setting] = typeof value !== 'undefined' ? value : localSettings[setting];
      localSettings = JSON.parse(JSON.stringify(settings));

      return settings;
    });
  }

  function changeLanguage(lang) {
    changeSetting('language', lang);
    locale.set(lang);
  }

  function changeNotificationSetting(value) {
    if (value && Notification.permission === 'default') {
      const permission = Notification.requestPermission();

      permission.then(answer => {
        if (answer === 'granted') {
          changeSetting('showNotifications', 1);
          showTestNotification();
        } else {
          changeSetting('showNotifications', 0);
        }
      })
    } else {
      changeSetting('showNotifications', value);
    }

    if (value && Notification.permission === 'granted') {
      showTestNotification();
    }
  }

  function showTestNotification() {
    new Notification($_('notifications.test'), { body: $_('notifications.test_body') });
    showNotificationWarning = true;
  }

  function getFactorString(factor) {
    if (!(factor % 1)) {
      return `${factor}.00`;
    } else {
      return String(factor).padEnd(4, '0');
    }
  }

  function changeDuration(intervalId, target, isRound = false) {
    const correctValue = isRound ? Math.ceil(target.value) : target.value;

    intervals.changeIntervalProp(intervalId, 'duration', correctValue);
    updateFactor();
    target.value = correctValue;
  }

</script>

<BasicModal bind:active on:close>
  <div class="settings">
    <div class="actions">
      <DefaultButton
        small
        on:click="{() => { isExpand = !isExpand }}"
      >
        {isExpand ? $_('settings.hide_all') : $_('settings.expand_all')}
      </DefaultButton>
    </div>
    <ExpandBlock
      title="{$_('intervals')}"
      active="{isExpand}"
    >
      <div class="intervals">
        {#each $intervalsArr as [intervalId, options]}
          <div class="interval-settings">
            <div class="settings-subtitle">{$_(options.label)}</div>
            <label class="settings-label">
              <div class="settings-label-text">{$_('duration')}:</div>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                class="settings-input"
                value="{options.duration}"
                on:change="{(event) => {
                  changeDuration(intervalId, event.target);
                }}"
              />
            </label>
            <label class="settings-label">
              <div class="settings-label-text">{$_('settings.title_interval')}:</div>
              <input
                type="text"
                class="settings-input"
                value="{options.title}"
                on:change="{event => {
                  intervals.changeIntervalProp(intervalId, 'title', event.target.value);
                }}"
              />
            </label>
            <label class="settings-label">
              <div class="settings-label-text">
                {$_('volume')}: {Math.round(options.sound.volume * 100)}%
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step=".01"
                class="settings-range"
                value="{options.sound.volume}"
                on:change="{event => {
                  intervals.changeSound(intervalId, {
                    volume: event.target.value,
                  });
                }}"
              />
            </label>
            <label class="settings-label">
              <div class="settings-label-text">{$_('sound')}:</div>
              <select
                class="interval-select"
                value="{options.sound.id}"
                on:change="{event => {
                  intervals.changeSound(intervalId, {
                    id: event.target.value,
                  });
                }}"
              >
                {#each $soundsArr as sound}
                  <option value="{sound.id}">{$_(sound.title)}</option>
                {/each}
              </select>
            </label>
            <DefaultButton on:click="{playAudio(intervalId)}" small vertical>
              {$_('play')}
            </DefaultButton>
            {#if intervalId !== 'main'}
              <div class="checkbox-setting">
                <DefaultCheckbox
                  text="{$_('use')}"
                  checked="{options.isActive}"
                  on:change="{event => {
                    intervals.changeIntervalProp(intervalId, 'isActive', +event.detail);
                  }}"
                  label
                />
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('language')}"
      active="{isExpand}"
    >
      <div class="languages">
        <div class="language-buttons">
          {#each $locales as lang}
            <DefaultButton
              on:click="{() => {
                changeLanguage(lang);
              }}"
              active="{$settings.language === lang}"
            >
              {$_(`languages.${lang}`)}
            </DefaultButton>
          {/each}
        </div>
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.general_interface')}"
      active="{isExpand}"
    >
        <div class="checkbox-setting">
          <DefaultCheckbox
            text="{$_('settings.time_title')}"
            bind:checked="{localSettings.showTimeInTitle}"
            on:change="{() => {
              changeSetting('showTimeInTitle');
            }}"
            label
          />
        </div>
        <div class="checkbox-setting">
          <DefaultCheckbox
            text="{$_('settings.time_favicon')}"
            bind:checked="{localSettings.showTimeInFavicon}"
            on:change="{() => {
              changeSetting('showTimeInFavicon');
            }}"
            label
          />
        </div>
        <div class="checkbox-setting">
          <DefaultCheckbox
            text="{$_('settings.colorful_favicon')}"
            bind:checked="{localSettings.showLastSecondsColorful}"
            on:change="{() => {
              changeSetting('showLastSecondsColorful');
            }}"
            label
          />
        </div>
        <div class="checkbox-setting">
          <DefaultCheckbox
            text="{$_('settings.show_planned_duration')}"
            bind:checked="{localSettings.showPlannedDuration}"
            on:change="{() => {
              changeSetting('showPlannedDuration');
            }}"
            label
          />
        </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.main_screen')}"
      active="{isExpand}"
    >
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.show_activity_near_timer')}"
          bind:checked="{localSettings.showActivityNearTimer}"
          on:change="{() => {
            changeSetting('showActivityNearTimer');
          }}"
          label
        />
      </div>
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.details_on_main_screen')}"
          bind:checked="{localSettings.showDetailsOnMainScreen}"
          on:change="{() => {
            changeSetting('showDetailsOnMainScreen');
          }}"
          label
        />
      </div>
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.show_main_tabs')}"
          bind:checked="{localSettings.showMainTabs}"
          on:change="{() => {
            changeSetting('showMainTabs');
          }}"
          label
        />
      </div>
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.show_comment')}"
          bind:checked="{localSettings.showComment}"
          on:change="{() => {
            changeSetting('showComment');
          }}"
          label
        />
      </div>
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.show_current_activity_main_screen')}"
          bind:checked="{localSettings.showCurrentActivityOnMainScreen}"
          on:change="{() => {
            changeSetting('showCurrentActivityOnMainScreen');
          }}"
          label
        />
      </div>
      {#if localSettings.showCurrentActivityOnMainScreen}
        <div class="checkbox-setting nested">
          <DefaultCheckbox
            text="{$_('settings.show_current_activity_label_main_screen')}"
            bind:checked="{localSettings.showCurrentActivityLabelOnMainScreen}"
            on:change="{() => {
              changeSetting('showCurrentActivityLabelOnMainScreen');
            }}"
            label
          />
        </div>
      {/if}
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.show_current_period_above_timer')}"
          bind:checked="{localSettings.showCurrentPeriodAboveTimer}"
          on:change="{() => {
            changeSetting('showCurrentPeriodAboveTimer');
          }}"
          label
        />
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.behaviour')}"
      active="{isExpand}"
    >
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.subtract_time')}"
          bind:checked="{localSettings.subtractTimeWhenFinishing}"
          on:change="{() => {
            changeSetting('subtractTimeWhenFinishing');
          }}"
          label
        />
      </div>
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.show_notifications')}"
          disabled="{Notification.permission === 'denied'}"
          bind:checked="{localSettings.showNotifications}"
          on:change="{(value) => {
            changeNotificationSetting(value.detail);
          }}"
          label
        />
        {#if localSettings && Notification.permission === 'denied'}
          <div class="setting-description">
            {$_('settings.change_notifications_permission')}
          </div>
        {/if}
        {#if showNotificationWarning}
        <div class="setting-description">
          {$_('notifications.warning')}
        </div>
        {/if}
      </div>
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.activity_factor')}"
      active="{isExpand}"
    >
      <div class="checkbox-setting">
        <DefaultCheckbox
          text="{$_('settings.use_activity_factor')}"
          bind:checked="{localSettings.useActivityFactor}"
          on:change="{() => {
            changeSetting('useActivityFactor');
          }}"
          label
        />
      </div>
      {#if localSettings.useActivityFactor}
        <div class="setting-description">
          {$_('settings.basic_factor')} <br>
          {$_('settings.formula_factor_sentence')} <br>
          {$_('settings.formula_factor')} <br>
          {$_('settings.current_counted_factor')}: {$calculatedActivityFactor}
        </div>
        <div class="checkbox-setting">
          <DefaultCheckbox
            text="{$_('settings.use_custom_activity_factor')}"
            bind:checked="{localSettings.useCustomActivityFactor}"
            on:change="{() => {
              changeSetting('useCustomActivityFactor');
            }}"
            label
          />
        </div>
        {#if localSettings.useCustomActivityFactor}
          <label class="settings-label">
            <div class="settings-label-text bigger">
              {getFactorString(localSettings.customActivityFactor)}
            </div>
            <input
                type="range"
                min=".1"
                max="3"
                step=".05"
                class="settings-range"
                value="{localSettings.customActivityFactor}"
                on:input="{event => {
                  changeSetting('customActivityFactor', event.target.value);
                }}"
              />
          </label>
        {/if}
      {/if}
    </ExpandBlock>
    <ExpandBlock
      title="{$_('settings.reset')}"
      active="{isExpand}"
    >
      <p class="setting-descr">
        {$_('settings.reset_warning')}
      </p>
      <DefaultButton
        on:click="{resetSettings}"
        small
        bordered
      >
        {$_('settings.reset_to_default')}
      </DefaultButton>
      <DefaultButton
        on:click="{resetHistory}"
        small
        bordered
      >
        {$_('settings.clear_history')}
      </DefaultButton>
      <DefaultButton
        on:click="{resetActivities}"
        small
        bordered
      >
        {$_('settings.remove_all_activities')}
      </DefaultButton>
      <DefaultButton
        on:click="{resetAll}"
        small
        bordered
      >
        {$_('settings.reset_all')}
      </DefaultButton>
    </ExpandBlock>
  </div>
</BasicModal>

<style lang="scss">
  .settings {
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
    padding: 0 10px;
    color: var(--color-text-softer);
  }
  .actions {
    text-align: right;
  }
  .intervals {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .languages {
    padding: 30px 0;
  }
  .interval-settings {
    width: 28%;
  }
  .interval-select {
    width: 100%;
    background: transparent;
    color: #888;
    border: none;
    text-align: left;
    margin-left: -8px;
    outline: none;
    font-size: 12px;
  }
  .settings-range {
    width: 100%;
    -webkit-appearance: none;
    outline: none;
    background: transparent;
    border: none;
    padding: 0;
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 5px;
      cursor: pointer;
      animate: .2s;
      box-shadow: 0px 0px 0px #999;
      background-color: #999;
      border-radius: 1px;
      border: 0px solid #999;
      transition: background-color .2s;
    }
    &::-webkit-slider-thumb {
      box-shadow: 0px 0px 0px #000;
      border: 0px solid #000;
      height: 15px;
      width: 15px;
      border-radius: 15px;
      background: #555;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -5px;
    }
    &:focus {
      &::-webkit-slider-runnable-track {
        background-color: #ccc;
      }
    }
  }
  .settings-input {
    background: none;
    border: none;
    border-bottom: 2px solid #666;
    transition: border-color .2s;
    color: #999;
    font-size: 12px;
    width: 100%;
    &:focus {
      outline: none;
      border-bottom-color: #aaa;
    }
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  .settings-subtitle {
    margin-bottom: 5px;
    min-height: 35px;
    font-size: 14px;
  }
  .settings-label {
    margin-bottom: 7px;
  }
  .settings-label-text {
    margin-bottom: 2px;
    font-size: 12px;
    &.bigger {
      text-align: center;
      font-size: 14px;
      color: #aaa;
    }
  }
  .setting-description {
    padding-top: 10px;
    font-size: 13px;
    color: #aaa;
  }
  .checkbox-setting {
    padding: 7px 0;
    &.nested {
      margin-left: 15px;
    }
  }
</style>
