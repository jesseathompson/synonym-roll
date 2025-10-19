/**
 * Google Analytics 4 Event Tracking Utilities
 * 
 * Provides type-safe event tracking functions for monitoring user interactions
 * and game metrics throughout the Synonym Roll application.
 */

// Event name constants following GA4 best practices
export const GA_EVENTS = {
	// Navigation events
	PAGE_VIEW: 'page_view',
	THEME_TOGGLE: 'theme_toggle',
	MODAL_OPEN: 'modal_open',
	MODAL_CLOSE: 'modal_close',

	// Game events
	GAME_START: 'game_start',
	WORD_SELECTED: 'word_selected',
	GAME_COMPLETE: 'game_complete',
	GAME_BACK: 'game_back',
	GAME_RESET: 'game_reset',

	// Social events
	SHARE_BUTTON_CLICK: 'share_button_click',
	SHARE_MODAL_OPEN: 'share_modal_open',
	SHARE_COPY_SUCCESS: 'share_copy_success',
	SHARE_COPY_FAILED: 'share_copy_failed',

	// Debug events (development only)
	DEBUG_SOLUTION_LOG: 'debug_solution_log',
	DEBUG_GAME_COMPLETE: 'debug_game_complete',
} as const;

// Type definitions for event parameters
export interface GameStartEvent {
	puzzle_number: number;
	start_word: string;
	end_word: string;
	streak: number;
	is_returning_player: boolean;
}

export interface WordSelectedEvent {
	word: string;
	step_number: number;
	available_synonyms_count: number;
	puzzle_number: number;
}

export interface GameCompleteEvent {
	puzzle_number: number;
	completion_time_seconds: number;
	steps_taken: number;
	min_steps: number;
	total_moves: number;
	efficiency_percentage: number;
	streak: number;
	win_rate: number;
	games_played: number;
}

export interface ThemeToggleEvent {
	new_theme: 'light' | 'dark';
	previous_theme: 'light' | 'dark';
}

export interface ModalEvent {
	modal_type: 'info' | 'settings' | 'share';
	action: 'open' | 'close';
}

export interface ShareEvent {
	puzzle_number: number;
	completion_time_seconds: number;
	steps_taken: number;
	efficiency_percentage: number;
	streak: number;
}

export interface ShareCopyEvent {
	success: boolean;
	method: 'clipboard' | 'native_share';
	puzzle_number: number;
}

// Check if gtag is available (handles development/production)
const isGtagAvailable = (): boolean => {
	return typeof window !== 'undefined' &&
		typeof (window as any).gtag === 'function' &&
		import.meta.env.VITE_GA_ID;
};

// Development logging helper
const logEvent = (eventName: string, parameters: Record<string, any>) => {
	if (import.meta.env.DEV) {
		console.log(`[GA4 Event] ${eventName}:`, parameters);
	}
};

/**
 * Track a custom event with parameters
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
	logEvent(eventName, parameters || {});

	if (isGtagAvailable()) {
		(window as any).gtag('event', eventName, parameters);
	}
};

/**
 * Track page view with custom parameters
 */
export const trackPageView = (pageName: string, additionalParams?: Record<string, any>) => {
	const parameters = {
		page_title: pageName,
		page_location: window.location.href,
		...additionalParams,
	};

	logEvent(GA_EVENTS.PAGE_VIEW, parameters);

	if (isGtagAvailable()) {
		(window as any).gtag('event', GA_EVENTS.PAGE_VIEW, parameters);
	}
};

/**
 * Track game start event
 */
export const trackGameStart = (params: GameStartEvent) => {
	trackEvent(GA_EVENTS.GAME_START, params);
};

/**
 * Track word selection event
 */
export const trackWordSelected = (params: WordSelectedEvent) => {
	trackEvent(GA_EVENTS.WORD_SELECTED, params);
};

/**
 * Track game completion event
 */
export const trackGameComplete = (params: GameCompleteEvent) => {
	trackEvent(GA_EVENTS.GAME_COMPLETE, params);
};

/**
 * Track theme toggle event
 */
export const trackThemeToggle = (params: ThemeToggleEvent) => {
	trackEvent(GA_EVENTS.THEME_TOGGLE, params);
};

/**
 * Track modal open/close event
 */
export const trackModal = (params: ModalEvent) => {
	trackEvent(params.action === 'open' ? GA_EVENTS.MODAL_OPEN : GA_EVENTS.MODAL_CLOSE, params);
};

/**
 * Track share button click
 */
export const trackShareButtonClick = (params: ShareEvent) => {
	trackEvent(GA_EVENTS.SHARE_BUTTON_CLICK, params);
};

/**
 * Track share modal open
 */
export const trackShareModalOpen = (params: ShareEvent) => {
	trackEvent(GA_EVENTS.SHARE_MODAL_OPEN, params);
};

/**
 * Track copy to clipboard result
 */
export const trackShareCopy = (params: ShareCopyEvent) => {
	const eventName = params.success ? GA_EVENTS.SHARE_COPY_SUCCESS : GA_EVENTS.SHARE_COPY_FAILED;
	trackEvent(eventName, params);
};

/**
 * Track game back button usage
 */
export const trackGameBack = (puzzleNumber: number, stepNumber: number) => {
	trackEvent(GA_EVENTS.GAME_BACK, {
		puzzle_number: puzzleNumber,
		step_number: stepNumber,
	});
};

/**
 * Track debug events (development only)
 */
export const trackDebugEvent = (eventName: string, params?: Record<string, any>) => {
	if (import.meta.env.DEV) {
		trackEvent(eventName, params);
	}
};

// Export type for use in components
export type GAEventName = typeof GA_EVENTS[keyof typeof GA_EVENTS];
