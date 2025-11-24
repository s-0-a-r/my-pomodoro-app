import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPanel } from '../SettingsPanel';
import { DEFAULT_SETTINGS } from '../../types/pomodoro';

describe('SettingsPanel', () => {
  const mockUpdateSettings = jest.fn();
  const mockResetSettings = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default behavior', () => {
    it('should render all settings sections', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
        />
      );

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Auto Repeat')).toBeInTheDocument();
      expect(screen.getByText(/Work Duration:/)).toBeInTheDocument();
      expect(screen.getByText(/Break Duration:/)).toBeInTheDocument();
      expect(screen.getByText(/Volume:/)).toBeInTheDocument();
    });

    it('should show duration settings by default', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
        />
      );

      expect(screen.getByText(/Work Duration:/)).toBeInTheDocument();
      expect(screen.getByText(/Break Duration:/)).toBeInTheDocument();
    });
  });

  describe('showDurationSettings prop', () => {
    it('should hide duration settings when showDurationSettings is false', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
          showDurationSettings={false}
        />
      );

      expect(screen.queryByText(/Work Duration:/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Break Duration:/)).not.toBeInTheDocument();
    });

    it('should still show volume and auto-repeat when duration settings are hidden', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
          showDurationSettings={false}
        />
      );

      expect(screen.getByText('Auto Repeat')).toBeInTheDocument();
      expect(screen.getByText(/Volume:/)).toBeInTheDocument();
    });
  });

  describe('Auto Repeat toggle', () => {
    it('should call onUpdateSettings when toggled', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
        />
      );

      const toggleButton = screen.getByRole('button', { name: '' });
      fireEvent.click(toggleButton);

      expect(mockUpdateSettings).toHaveBeenCalledWith({ autoRepeat: false });
    });
  });

  describe('Volume control', () => {
    it('should call onUpdateSettings when volume is changed', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
        />
      );

      const volumeSlider = screen.getByRole('slider');
      fireEvent.change(volumeSlider, { target: { value: '0.8' } });

      expect(mockUpdateSettings).toHaveBeenCalledWith({ volume: 0.8 });
    });
  });

  describe('Reset button', () => {
    it('should call onResetSettings when clicked', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
        />
      );

      const resetButton = screen.getByText('Reset to Default');
      fireEvent.click(resetButton);

      expect(mockResetSettings).toHaveBeenCalled();
    });
  });

  describe('Disabled state', () => {
    it('should disable all controls when isDisabled is true', () => {
      render(
        <SettingsPanel
          settings={DEFAULT_SETTINGS}
          onUpdateSettings={mockUpdateSettings}
          onResetSettings={mockResetSettings}
          isDisabled={true}
        />
      );

      const resetButton = screen.getByText('Reset to Default');
      expect(resetButton).toBeDisabled();

      const volumeSlider = screen.getByRole('slider');
      expect(volumeSlider).toBeDisabled();
    });
  });
});
