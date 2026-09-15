import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import BusinessCaseCalculator from '../../src/components/islands/BusinessCaseCalculator';

const disclaimer =
  'Estimates are for planning only and are based entirely on the values you enter. They do not guarantee time savings, financial benefit, or final Zeno pricing.';
const privacyStatement = 'Nothing entered here is sent or saved.';
const calculatorProps = {
  disclaimer,
  method:
    'Choose a team range or exact number. Enter weekly hours returned and the value of one hour. Ranges use the rounded midpoint shown. Add an annual budget only if you want to compare it with the estimated yearly value of recovered time.',
  pilotMethod:
    'Pilot size uses 20 percent of the team, rounded to a whole person. Use at least five people when the team allows it and no more than 20. The pilot never exceeds the team entered.',
  pilotStatement: 'A focused pilot gives you a value to validate before a wider rollout.',
  privacyStatement,
  title: 'Build the estimate in three steps.',
};

async function completeEstimate(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('radio', { name: '26 to 50' }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  await user.click(screen.getByRole('radio', { name: '1 hour' }));
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  await user.click(screen.getByRole('radio', { name: '€75' }));
  await user.click(screen.getByRole('button', { name: 'See estimate' }));
}

describe('BusinessCaseCalculator', () => {
  it('server-renders the first question disabled before hydration', () => {
    const markup = renderToStaticMarkup(<BusinessCaseCalculator {...calculatorProps} />);
    const document = new DOMParser().parseFromString(markup, 'text/html');

    expect(document.querySelector('.business-case-calculator')?.getAttribute('data-hydrated')).toBe(
      'false',
    );
    expect(document.querySelectorAll('input[name="peopleChoice"]')).toHaveLength(7);
    expect(
      Array.from(document.querySelectorAll('input[name="peopleChoice"]')).every((input) =>
        input.hasAttribute('disabled'),
      ),
    ).toBe(true);
    expect(document.querySelector('input[name="people"]')).toBeNull();
    expect(document.querySelector('button[type="submit"]')?.hasAttribute('disabled')).toBe(true);
  });

  it('shows one plain-language question at a time and retains answers when going back', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    const teamSize = screen.getByRole('radio', { name: '26 to 50' });
    await waitFor(() => expect(teamSize).toBeEnabled());
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Choose a team size' })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: '1 hour' })).not.toBeInTheDocument();

    await user.click(teamSize);
    expect(screen.getByText('38 people')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(
      screen.getByRole('heading', { name: 'How many hours could each person get back each week?' }),
    ).toHaveFocus();
    await user.click(screen.getByRole('radio', { name: '1 hour' }));
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('radio', { name: '26 to 50' })).toBeChecked();
    expect(screen.getByText('38 people')).toBeInTheDocument();
  });

  it('associates validation feedback and focuses the invalid current question', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    const firstRange = screen.getByRole('radio', { name: '1 to 10' });
    await waitFor(() => expect(firstRange).toBeEnabled());
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const error = screen.getByRole('alert');
    expect(error).toHaveTextContent('Choose a team size or enter a custom amount.');
    expect(firstRange).toHaveFocus();
    expect(screen.getByRole('group', { name: 'Choose a team size' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('focuses and preserves an exact custom amount when choices change', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    const custom = screen.getByRole('radio', { name: 'Custom amount' });
    await waitFor(() => expect(custom).toBeEnabled());

    await user.click(custom);
    const exactPeople = screen.getByLabelText('Exact number of people');
    expect(exactPeople).toHaveFocus();
    await user.type(exactPeople, '73');
    await user.click(screen.getByRole('radio', { name: '51 to 100' }));
    await user.click(custom);

    expect(screen.getByLabelText('Exact number of people')).toHaveValue(73);
    expect(screen.getByLabelText('Exact number of people')).toHaveFocus();
  });

  it('shows the two core results, then adds explained ROI after a budget is supplied', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() => expect(screen.getByRole('radio', { name: '26 to 50' })).toBeEnabled());
    await completeEstimate(user);

    const fullTeam = await screen.findByRole('region', { name: 'Full team estimate' });
    expect(within(fullTeam).getByText(/1,748 hours/)).toBeInTheDocument();
    expect(screen.getByText('€131,100')).toBeInTheDocument();
    expect(screen.queryByText('Estimated ROI')).not.toBeInTheDocument();
    expect(screen.queryByText('Estimated net annual value')).not.toBeInTheDocument();
    expect(screen.queryByText('Estimated return multiple')).not.toBeInTheDocument();
    const pilotHeading = screen.getByRole('heading', { name: 'Test the case with 8 people.' });
    const pilot = pilotHeading.closest('section')!;
    expect(pilotHeading).toBeInTheDocument();
    expect(within(pilot).getByText(/368 hours/)).toBeInTheDocument();
    expect(within(pilot).getByText('€27,600')).toBeInTheDocument();
    expect(within(pilot).getByRole('link', { name: 'Plan this pilot' })).toHaveAttribute(
      'href',
      '/demo',
    );

    await user.click(screen.getByText('Compare with an annual budget'));
    await user.type(screen.getByLabelText('Annual budget to compare'), '200000');
    expect(await screen.findByText('-34.4%')).toBeInTheDocument();
    expect(screen.getByText('Estimated ROI against this budget')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Estimated ROI = (yearly time value minus annual budget) divided by annual budget.',
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/payback/i)).not.toBeInTheDocument();
  });

  it('explains the 18-person example as recovered time and a practical pilot', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() => expect(screen.getByRole('radio', { name: '11 to 25' })).toBeEnabled());

    await user.click(screen.getByRole('radio', { name: '11 to 25' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('radio', { name: '2 hours' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('radio', { name: '€50' }));
    await user.click(screen.getByRole('button', { name: 'See estimate' }));

    expect(
      await screen.findByRole('heading', { name: 'What your team could get back' }),
    ).toBeInTheDocument();
    expect(screen.getByText('€82,800')).toBeInTheDocument();
    const fullTeam = screen.getByRole('region', { name: 'Full team estimate' });
    expect(within(fullTeam).getByText(/1,656 hours/)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Based on 18 people, 2 hours each week, €50 per hour, and 46 working weeks.',
      ),
    ).toBeInTheDocument();
    const pilotHeading = screen.getByRole('heading', { name: 'Test the case with 5 people.' });
    const pilot = pilotHeading.closest('section')!;
    expect(pilotHeading).toBeInTheDocument();
    expect(within(pilot).getByText('€23,000')).toBeInTheDocument();
    expect(within(pilot).getByText(/460 hours/)).toBeInTheDocument();
    expect(screen.queryByText(/annual capacity value/i)).not.toBeInTheDocument();
  });

  it('keeps the working year secondary and changes currency formatting without conversion', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() => expect(screen.getByRole('radio', { name: '26 to 50' })).toBeEnabled());
    await user.click(screen.getByRole('radio', { name: '26 to 50' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('radio', { name: '1 hour' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.selectOptions(screen.getByLabelText('Currency'), 'USD');
    await user.click(screen.getByRole('radio', { name: 'US$75' }));
    await user.click(screen.getByRole('button', { name: 'See estimate' }));

    expect(await screen.findByText('US$131,100')).toBeInTheDocument();
    await user.click(screen.getByText('Calculation settings'));
    expect(screen.getByLabelText('Working weeks per year')).toHaveValue(46);
    expect(screen.getByText(calculatorProps.pilotMethod)).toBeInTheDocument();
    expect(screen.getByText(privacyStatement)).toBeInTheDocument();
    expect(screen.getByText(disclaimer)).toBeInTheDocument();
  });

  it('focuses and retains custom values on the later guided questions', async () => {
    const user = userEvent.setup();
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() => expect(screen.getByRole('radio', { name: '26 to 50' })).toBeEnabled());
    await user.click(screen.getByRole('radio', { name: '26 to 50' }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.click(screen.getByRole('radio', { name: 'Custom hours' }));
    const customHours = screen.getByLabelText('Custom weekly hours');
    expect(customHours).toHaveFocus();
    await user.type(customHours, '3.5');
    await user.click(screen.getByRole('radio', { name: '4 hours' }));
    await user.click(screen.getByRole('radio', { name: 'Custom hours' }));
    expect(screen.getByLabelText('Custom weekly hours')).toHaveValue(3.5);
  });

  it('does not fetch, persist, track, or serialize visitor assumptions', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const beforeUrl = window.location.href;
    render(<BusinessCaseCalculator {...calculatorProps} />);
    await waitFor(() => expect(screen.getByRole('radio', { name: '26 to 50' })).toBeEnabled());
    await completeEstimate(user);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(window.localStorage).toHaveLength(0);
    expect(window.sessionStorage).toHaveLength(0);
    expect(window.location.href).toBe(beforeUrl);
    vi.unstubAllGlobals();
  });
});
