import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import BusinessCaseCalculator from '../../src/components/islands/BusinessCaseCalculator';

const disclaimer =
  'These estimates are for planning only. They combine the time and team size you choose with the displayed recovery and hourly-value assumptions. They do not guarantee time savings, financial benefit, or final Zeno pricing.';
const privacyStatement = 'Nothing entered here is sent or saved.';
const method =
  'Planning example: 25% of this time recovered over 46 weeks. Each hour uses 50 in the selected currency. Change these in Calculation settings.';
const calculatorProps = {
  disclaimer,
  pilotMethod:
    'Pilot size uses 20 percent of the team, rounded to a whole person. Use at least five people when the team allows it and no more than 20. The pilot never exceeds the team entered.',
  pilotStatement: 'A focused pilot gives you a value to validate before a wider rollout.',
  privacyStatement,
  title: 'Build an estimate in three choices.',
};

async function completeEstimate(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('checkbox', { name: 'Report generation' }));
  await user.click(screen.getByRole('checkbox', { name: 'Presentation creation' }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  await user.click(screen.getByRole('radio', { name: 'About 4 hours' }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  await user.click(screen.getByRole('radio', { name: '11 to 25' }));
  await user.click(screen.getByRole('button', { name: 'See estimate' }));
}

describe('BusinessCaseCalculator', () => {
  it('server-renders disabled work choices before hydration', () => {
    const markup = renderToStaticMarkup(<BusinessCaseCalculator {...calculatorProps} />);
    const document = new DOMParser().parseFromString(markup, 'text/html');
    expect(document.querySelector('.business-case-calculator')?.getAttribute('data-hydrated')).toBe(
      'false',
    );
    expect(document.querySelectorAll('input[name="workTypeIds"]')).toHaveLength(6);
    expect(
      Array.from(document.querySelectorAll('input[name="workTypeIds"]')).every((input) =>
        input.hasAttribute('disabled'),
      ),
    ).toBe(true);
    expect(document.querySelector('button[type="submit"]')?.hasAttribute('disabled')).toBe(true);
  });

  it('supports multi-select and retains one combined-time answer through Back and Edit', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    const report = screen.getByRole('checkbox', { name: 'Report generation' });
    await waitFor(() => expect(report).toBeEnabled());
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.queryByText(method)).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'About 4 hours' })).not.toBeInTheDocument();

    await user.click(report);
    await user.click(screen.getByRole('checkbox', { name: 'Email triage' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.queryByText(method)).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'About how many hours does one person spend on this work each week?',
      }),
    ).toHaveFocus();
    await user.click(screen.getByRole('radio', { name: 'About 4 hours' }));
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(report).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Email triage' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('radio', { name: 'About 4 hours' })).toBeChecked();
  });

  it('reports an empty work selection and focuses its first checkbox', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    const firstWork = screen.getByRole('checkbox', { name: 'Report generation' });
    await waitFor(() => expect(firstWork).toBeEnabled());
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Choose at least one work type.');
    expect(firstWork).toHaveFocus();
    expect(screen.getByRole('group', { name: 'Choose all that apply' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByRole('group', { name: 'Choose all that apply' })).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('business-case-workTypeIds-error'),
    );
  });

  it('preserves custom weekly time and custom team size when switching choices', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    const report = screen.getByRole('checkbox', { name: 'Report generation' });
    await waitFor(() => expect(report).toBeEnabled());
    await user.click(report);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.click(screen.getByRole('radio', { name: 'Custom hours' }));
    const hours = screen.getByLabelText('Custom weekly hours');
    expect(hours).toHaveFocus();
    await user.type(hours, '3.5');
    await user.click(screen.getByRole('radio', { name: 'About 4 hours' }));
    await user.click(screen.getByRole('radio', { name: 'Custom hours' }));
    expect(screen.getByLabelText('Custom weekly hours')).toHaveValue(3.5);
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.click(screen.getByRole('radio', { name: 'Custom amount' }));
    const people = screen.getByLabelText('Exact number of people');
    expect(people).toHaveFocus();
    await user.type(people, '73');
    await user.click(screen.getByRole('radio', { name: '51 to 100' }));
    await user.click(screen.getByRole('radio', { name: 'Custom amount' }));
    expect(screen.getByLabelText('Exact number of people')).toHaveValue(73);
  });

  it('shows the annualized team and pilot scenario in plain language, without ROI', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() =>
      expect(screen.getByRole('checkbox', { name: 'Report generation' })).toBeEnabled(),
    );
    await completeEstimate(user);

    const team = await screen.findByRole('region', { name: 'Full team estimate' });
    expect(within(team).getByText('€41,400')).toBeInTheDocument();
    expect(within(team).getByText(/828 hours/)).toBeInTheDocument();
    expect(within(team).getByText(/Report generation, Presentation creation/)).toBeInTheDocument();
    expect(within(team).getByText(/18 people, 4 combined hours/)).toBeInTheDocument();
    const pilotHeading = screen.getByRole('heading', { name: 'Test the case with 5 people.' });
    const pilot = pilotHeading.closest('section')!;
    expect(within(pilot).queryByText('€11,500')).not.toBeInTheDocument();
    expect(
      within(pilot).queryByText(/This pilot group could validate about/),
    ).not.toBeInTheDocument();
    expect(within(pilot).getByText(/230 hours/)).toBeInTheDocument();
    expect(within(pilot).getByRole('link', { name: 'Plan this pilot' })).toHaveAttribute(
      'href',
      '/demo',
    );
    expect(screen.queryByText(/Estimated ROI|annual budget/i)).not.toBeInTheDocument();
    expect(screen.queryByText(method)).not.toBeInTheDocument();
    expect(screen.getByText(/Potential yearly value of time recovered:/)).not.toHaveTextContent(
      '€11,500',
    );
    expect(screen.getByText(disclaimer)).toBeInTheDocument();
  });

  it('recalculates settings, changes formatting without conversion, and recovers from invalid input', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() =>
      expect(screen.getByRole('checkbox', { name: 'Report generation' })).toBeEnabled(),
    );
    await completeEstimate(user);
    await user.click(screen.getByText('Calculation settings', { exact: true }));
    expect(screen.getByLabelText('Time recovered (%)')).toHaveValue(25);
    expect(screen.getByLabelText('Planning value per hour')).toHaveValue(50);
    expect(screen.getByLabelText('Working weeks per year')).toHaveValue(46);
    expect(screen.getByText(calculatorProps.pilotMethod)).toBeInTheDocument();
    expect(screen.queryByText(method)).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText('Time recovered (%)'));
    expect(screen.getAllByRole('alert').map((alert) => alert.textContent)).toContain(
      'Check Calculation settings to restore the estimate.',
    );
    expect(screen.queryByText('€41,400')).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Time recovered (%)'), '50');
    expect(await screen.findByText('€82,800')).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Currency'), 'USD');
    expect(await screen.findByText('US$82,800')).toBeInTheDocument();
    expect(screen.getByText('Formatting only. No conversion.')).toBeInTheDocument();
  });

  it('does not recommend a pilot when the recovery scenario is zero', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() =>
      expect(screen.getByRole('checkbox', { name: 'Report generation' })).toBeEnabled(),
    );
    await completeEstimate(user);
    await user.click(screen.getByText('Calculation settings', { exact: true }));
    await user.clear(screen.getByLabelText('Time recovered (%)'));
    await user.type(screen.getByLabelText('Time recovered (%)'), '0');
    expect(await screen.findByText('€0')).toBeInTheDocument();
    expect(screen.getByText(/At 0% time recovered/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Plan this pilot' })).not.toBeInTheDocument();
  });

  it('keeps all visitor selections local and outside the URL', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const beforeUrl = window.location.href;
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() =>
      expect(screen.getByRole('checkbox', { name: 'Report generation' })).toBeEnabled(),
    );
    await completeEstimate(user);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(window.localStorage).toHaveLength(0);
    expect(window.sessionStorage).toHaveLength(0);
    expect(window.location.href).toBe(beforeUrl);
    vi.unstubAllGlobals();
  });

  it('localizes the guided journey, number formatting, and pilot destination in German', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} locale="de" />);

    const report = screen.getByRole('checkbox', { name: 'Berichte erstellen' });
    await waitFor(() => expect(report).toBeEnabled());
    expect(screen.getByText('Schritt 1 von 3')).toBeInTheDocument();
    await user.click(report);
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('radio', { name: 'Etwa 4 Stunden' }));
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('radio', { name: '11 bis 25' }));
    await user.click(screen.getByRole('button', { name: 'Schätzung anzeigen' }));

    expect(
      await screen.findByRole('heading', { name: 'Was das Team zurückgewinnen kann' }),
    ).toBeInTheDocument();
    expect(document.querySelector('.business-case-value-figure')).toHaveTextContent('41.400 €');
    expect(document.querySelector('.business-case-hours-summary')).toHaveTextContent('828 Stunden');
    expect(screen.getByRole('link', { name: 'Pilot planen' })).toHaveAttribute('href', '/de/demo');
  });

  it('returns complete German validation messages', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} locale="de" />);
    const report = screen.getByRole('checkbox', { name: 'Berichte erstellen' });
    await waitFor(() => expect(report).toBeEnabled());
    await user.click(report);
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('radio', { name: 'Genaue Stundenzahl' }));
    await user.type(screen.getByLabelText('Eigene Wochenstunden'), '100');
    await user.click(screen.getByRole('button', { name: 'Weiter' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Wöchentliche Zeit pro Person muss zwischen 0.5 und 80 liegen.',
    );
    expect(screen.getByRole('alert')).not.toHaveTextContent(/must be between| and /);
  });
});
