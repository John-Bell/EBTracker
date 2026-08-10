import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useSettings } from '../hooks/useSettings';
import { getSyncBtnClasses, getContainerClasses } from '../utils/settingsUtils';

export function Settings() {
  const {
    localCalorieGoal,
    setLocalCalorieGoal,
    localWaterGoal,
    setLocalWaterGoal,
    localEndpointUrl,
    setLocalEndpointUrl,
    localHeaderName,
    setLocalHeaderName,
    localHeaderKey,
    setLocalHeaderKey,
    goalsSaved,
    configSaved,
    syncState,
    focusedInput,
    setFocusedInput,
    handleSaveGoals,
    handleSaveConfig,
    handleClearCache,
    handleSync,
  } = useSettings();

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <Header title="Settings" />

      <main className="pb-32 pt-4">
        {/* Goals Section */}
        <div className="ios-inset-group">
          <div className="mb-2 px-2">
            <span className="font-label-caps text-on-surface-variant uppercase text-[12px] tracking-wider">Daily Goals</span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Calorie Goal */}
            <div className={getContainerClasses(focusedInput, 'calories')}>
              <div className="w-10 flex items-center text-primary">
                <span className="material-symbols-outlined">nutrition</span>
              </div>
              <div className="flex-1 flex flex-col py-3">
                <label htmlFor="calorie-goal-input" className="text-[13px] font-semibold text-on-surface-variant mb-0.5">Calorie Goal</label>
                <div className="flex items-center">
                  <input
                    id="calorie-goal-input"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-lg placeholder:text-outline-variant focus:outline-none"
                    placeholder="2000"
                    type="number"
                    value={localCalorieGoal}
                    onChange={(e) => setLocalCalorieGoal(e.target.value)}
                    onFocus={() => setFocusedInput('calories')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <span className="text-body-sm text-outline-variant ml-2">kcal</span>
                </div>
              </div>
            </div>

            {/* Water Goal */}
            <div className={getContainerClasses(focusedInput, 'water')}>
              <div className="w-10 flex items-center text-primary">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <div className="flex-1 flex flex-col py-3">
                <label htmlFor="water-goal-input" className="text-[13px] font-semibold text-on-surface-variant mb-0.5">Water Goal</label>
                <div className="flex items-center">
                  <input
                    id="water-goal-input"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-lg placeholder:text-outline-variant focus:outline-none"
                    placeholder="2500"
                    type="number"
                    value={localWaterGoal}
                    onChange={(e) => setLocalWaterGoal(e.target.value)}
                    onFocus={() => setFocusedInput('water')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <span className="text-body-sm text-outline-variant ml-2">ml</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveGoals}
            className="mt-4 w-full h-[50px] bg-primary text-on-primary rounded-xl font-semibold text-body-lg active:scale-[0.98] transition-all duration-150 shadow-[0px_4px_12px_rgba(0,88,188,0.2)]"
          >
            {goalsSaved ? 'Goals Saved!' : 'Save Goals'}
          </button>
        </div>

        {/* API Configuration Card */}
        <div className="ios-inset-group">
          <div className="mb-2 px-2">
            <span className="font-label-caps text-on-surface-variant uppercase text-[12px] tracking-wider">Server Config</span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Endpoint URL */}
            <div className={getContainerClasses(focusedInput, 'endpoint')}>
              <div className="w-10 flex items-center text-primary">
                <span className="material-symbols-outlined">dns</span>
              </div>
              <div className="flex-1 flex flex-col py-3">
                <label htmlFor="endpoint-url-input" className="text-[13px] font-semibold text-on-surface-variant mb-0.5">Endpoint URL</label>
                <input
                  id="endpoint-url-input"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-lg placeholder:text-outline-variant focus:outline-none"
                  placeholder="https://api.ebtracker.io/v1"
                  type="text"
                  value={localEndpointUrl}
                  onChange={(e) => setLocalEndpointUrl(e.target.value)}
                  onFocus={() => setFocusedInput('endpoint')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>

            {/* Header Name */}
            <div className={getContainerClasses(focusedInput, 'headerName')}>
              <div className="w-10 flex items-center text-secondary">
                <span className="material-symbols-outlined">label</span>
              </div>
              <div className="flex-1 flex flex-col py-3">
                <label htmlFor="header-name-input" className="text-[13px] font-semibold text-on-surface-variant mb-0.5">Header Name</label>
                <input
                  id="header-name-input"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-lg placeholder:text-outline-variant focus:outline-none"
                  placeholder="X-Custom-Auth"
                  type="text"
                  value={localHeaderName}
                  onChange={(e) => setLocalHeaderName(e.target.value)}
                  onFocus={() => setFocusedInput('headerName')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>

            {/* Header Key */}
            <div className={getContainerClasses(focusedInput, 'headerKey')}>
              <div className="w-10 flex items-center text-tertiary">
                <span className="material-symbols-outlined">key</span>
              </div>
              <div className="flex-1 flex flex-col py-3">
                <label htmlFor="header-key-input" className="text-[13px] font-semibold text-on-surface-variant mb-0.5">Header Key</label>
                <input
                  id="header-key-input"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-lg placeholder:text-outline-variant focus:outline-none"
                  type="password"
                  placeholder="Enter key"
                  value={localHeaderKey}
                  onChange={(e) => setLocalHeaderKey(e.target.value)}
                  onFocus={() => setFocusedInput('headerKey')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveConfig}
            className="mt-6 w-full h-[50px] bg-primary text-on-primary rounded-xl font-semibold text-body-lg active:scale-[0.98] transition-all duration-150 shadow-[0px_4px_12px_rgba(0,88,188,0.2)]"
          >
            {configSaved ? 'Configuration Saved!' : 'Save Configuration'}
          </button>
        </div>

        {/* Sync Status Card */}
        <div className="ios-inset-group">
          <div className="mb-2 px-2">
            <span className="font-label-caps text-on-surface-variant uppercase text-[12px] tracking-wider">Local Database</span>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] p-[16px]">
            <div className="flex justify-between items-center">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sync_problem</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface">Sync Status</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">5 unsynced items stored locally</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                className={getSyncBtnClasses(syncState)}
                onClick={handleSync}
                disabled={syncState !== 'idle'}
              >
                {syncState === 'idle' && (
                  <>
                    <span className="material-symbols-outlined text-[20px]">sync</span>
                    Force Sync
                  </>
                )}
                {syncState === 'syncing' && (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Syncing...
                  </>
                )}
                {syncState === 'synced' && (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Synced
                  </>
                )}
              </button>
              <p className="text-caption text-outline text-center px-4">
                Last successful sync was today at 09:41 AM
              </p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="ios-inset-group">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="relative flex items-center justify-between min-h-[44px] px-4 ios-list-item cursor-pointer active:bg-surface-variant/10 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-outline">info</span>
                <span className="text-body-lg">Version</span>
              </div>
              <span className="text-body-lg text-on-surface-variant">2.4.0 (Build 89)</span>
            </div>
            <div className="relative flex items-center justify-between min-h-[44px] px-4 ios-list-item cursor-pointer active:bg-surface-variant/10 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-outline">storage</span>
                <span className="text-body-lg">Storage Usage</span>
              </div>
              <span className="text-body-lg text-on-surface-variant">14.2 MB</span>
            </div>
            <div
              onClick={handleClearCache}
              className="relative flex items-center justify-between min-h-[44px] px-4 ios-list-item cursor-pointer active:bg-surface-variant/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-error">delete_forever</span>
                <span className="text-body-lg text-error">Clear Local Cache</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[20px]">chevron_right</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav activeTab="settings" />
    </div>
  );
}
