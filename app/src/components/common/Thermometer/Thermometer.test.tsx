import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Thermometer } from './Thermometer';

describe('Thermometer Component', () => {
  it('renders thermometer with correct temperature', () => {
    render(<Thermometer temperature={0.5} size="md" showLabels={true} />);
    
    // Check if thermometer track is rendered
    const thermometerTrack = screen.getByRole('generic');
    expect(thermometerTrack).toBeInTheDocument();
  });

  it('renders with labels when showLabels is true', () => {
    render(<Thermometer temperature={0.5} size="md" showLabels={true} />);
    
    expect(screen.getByText('Cold')).toBeInTheDocument();
    expect(screen.getByText('Hot')).toBeInTheDocument();
  });

  it('does not render labels when showLabels is false', () => {
    render(<Thermometer temperature={0.5} size="md" showLabels={false} />);
    
    expect(screen.queryByText('Cold')).not.toBeInTheDocument();
    expect(screen.queryByText('Hot')).not.toBeInTheDocument();
  });

  it('applies correct size class', () => {
    const { container } = render(<Thermometer temperature={0.5} size="lg" showLabels={true} />);
    
    const thermometer = container.querySelector('.thermometer--lg');
    expect(thermometer).toBeInTheDocument();
  });

  it('clamps temperature values correctly', () => {
    // Test temperature below 0
    const { container: container1 } = render(<Thermometer temperature={-0.5} size="md" showLabels={true} />);
    const arrow1 = container1.querySelector('.thermometer__arrow');
    expect(arrow1).toHaveStyle({ left: '0%' });

    // Test temperature above 1
    const { container: container2 } = render(<Thermometer temperature={1.5} size="md" showLabels={true} />);
    const arrow2 = container2.querySelector('.thermometer__arrow');
    expect(arrow2).toHaveStyle({ left: '100%' });
  });

  it('applies correct arrow position', () => {
    const { container } = render(<Thermometer temperature={0.75} size="md" showLabels={true} />);
    
    const arrow = container.querySelector('.thermometer__arrow');
    expect(arrow).toHaveStyle({ left: '75%' });
  });

  it('applies correct temperature category class', () => {
    // Test hot temperature
    const { container: hotContainer } = render(<Thermometer temperature={0.9} size="md" showLabels={true} />);
    const hotArrow = hotContainer.querySelector('.thermometer__arrow--hot');
    expect(hotArrow).toBeInTheDocument();

    // Test cold temperature
    const { container: coldContainer } = render(<Thermometer temperature={0.05} size="md" showLabels={true} />);
    const coldArrow = coldContainer.querySelector('.thermometer__arrow--cold');
    expect(coldArrow).toBeInTheDocument();
  });

  it('displays correct temperature category text', () => {
    render(<Thermometer temperature={0.9} size="md" showLabels={true} />);
    expect(screen.getByText('HOT')).toBeInTheDocument();

    render(<Thermometer temperature={0.05} size="md" showLabels={true} />);
    expect(screen.getByText('COLD')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Thermometer temperature={0.5} size="md" showLabels={true} className="custom-thermometer" />
    );
    
    const thermometer = container.querySelector('.custom-thermometer');
    expect(thermometer).toBeInTheDocument();
  });
});
