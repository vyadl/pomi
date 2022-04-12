<script>
  import { _, locale } from 'svelte-i18n';
  import { intervals, intervalsArr, playAudio } from './../store/intervals.js';
  import { soundsArr } from './../store/sounds.js';
  import { settings } from './../store/settings.js';
  import { calculatedActivityFactor } from './../store/intervals.js';
  import DefaultButton from './DefaultButton.svelte';
  import DefaultCheckbox from './DefaultCheckbox.svelte';
  import BasicModal from './BasicModal.svelte';

  export let active = false;


  let localSettings = JSON.parse(JSON.stringify($settings));

  function changeSetting(setting, value) {
    settings.update(settings => {
      settings[setting] = value || localSettings[setting];
      localSettings = JSON.parse(JSON.stringify(settings));

      return settings;
    });
  }

  function changeLanguage(lang) {
    changeSetting('language', lang);
    locale.set(lang);
  }

  function getFactorString(factor) {
    if (!(factor % 1)) {
      return `${factor}.00`;
    } else {
      return String(factor).padEnd(4, '0');
    }
  }

  function changeInterval(target, interval) {
    intervals.changeDuration(interval[0], Math.ceil(target.value));
    target.value = Math.ceil(target.value);
  }
</script>

<BasicModal bind:active on:close>
  <div class="settings">
    <div class="section">
      <div class="settings-title">{$_('intervals')}</div>
      <div class="intervals">
        {#each $intervalsArr as interval}
          <div class="interval-settings">
            <div class="settings-subtitle">{$_(interval[1].label)}</div>
            <label class="settings-label">
              <div class="settings-label-text">{$_('duration')}:</div>
              <input
                type="number"
                min="1"
                max="100"
                step="1"
                class="settings-input"
                value="{interval[1].duration}"
                on:change="{(event) => {
                    changeInterval(event.target, interval);
                  }}"
              />
            </label>
            <label class="settings-label">
              <div class="settings-label-text">
                {$_('volume')}: {Math.round(interval[1].sound.volume * 100)}%
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="settings-range"
                value="{interval[1].sound.volume}"
                on:change="{event => {
                  intervals.changeSound(interval[0], {
                    volume: event.target.value,
                  });
                }}"
              />
            </label>
            <label class="settings-label">
              <div class="settings-label-text">{$_('sound')}:</div>
              <select
                class="interval-select"
                value="{interval[1].sound.id}"
                on:change="{event => {
                  intervals.changeSound(interval[0], {
                    id: event.target.value,
                  });
                }}"
              >
                {#each $soundsArr as sound}
                  <option value="{sound.id}">{$_(sound.title)}</option>
                {/each}
              </select>
            </label>
            <DefaultButton on:click="{playAudio(interval[0])}" small vertical>
              {$_('play')}
            </DefaultButton>
          </div>
        {/each}
      </div>
    </div>
    <div class="section">
      <div class="settings-title">{$_('language')}</div>
      <div class="languages">
        <div class="language-buttons">
          <DefaultButton
            on:click="{() => {
              changeLanguage('en');
            }}"
            active="{$settings.language === 'en'}"
          >
            {$_('languages.en')}
          </DefaultButton>
          <DefaultButton
            on:click="{() => {
              changeLanguage('ru');
            }}"
            active="{$settings.language === 'ru'}"
          >
            {$_('languages.ru')}
          </DefaultButton>
        </div>
      </div>
    </div>
    <div class="section">
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
          text="{$_('settings.show_planned_duration')}"
          bind:checked="{localSettings.showPlannedDuration}"
          on:change="{() => {
            changeSetting('showPlannedDuration');
          }}"
          label
        />
      </div>
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
        <div class="factor-description">
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
                min="0.1"
                max="3"
                step="0.05"
                class="settings-range"
                value="{localSettings.customActivityFactor}"
                on:input="{event => {
                  changeSetting('customActivityFactor', event.target.value);
                }}"
              />
          </label>
        {/if}
      {/if}
    </div>
  </div>
</BasicModal>

<style lang="scss">
  .settings {
    margin: 0 auto;
    width: 100%;
    max-width: 400px;
    padding: 0 10px;
  }
  .section {
    padding: 10px 0;
    border-bottom: 1px solid #222;
    &:last-child {
      border: none;
    }
  }
  .settings-title {
    margin-bottom: 10px;
  }
  .intervals {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .languages {
    margin-bottom: 15px;
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
      animate: 0.2s;
      box-shadow: 0px 0px 0px #999;
      background-color: #999;
      border-radius: 1px;
      border: 0px solid #999;
      transition: background-color 0.2s;
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
    transition: border-color 0.2s;
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
  .factor-description {
    font-size: 13px;
    color: #aaa;
  }
  .checkbox-setting {
    padding: 7px 0;
  }
</style>
