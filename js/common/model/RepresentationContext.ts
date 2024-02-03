// Copyright 2023, University of Colorado Boulder

/**
 * This simulation displays similar representations in different contexts. At the top of the screen, there is an
 * accordion box that can show either a card representation or a dot plot/line plot representation with additional
 * artifacts for the statistical measures. Each screen also features an info button, which shows an info dialog that
 * displays a similar representation.
 *
 * Since there are subtle but significant differences between each context, we use this type alias to distinguish between
 * them. For example, the cards are interactive in the accordion box, but non-interactive in the info dialog. Similarly,
 * the MAD (Mean Absolute Deviation) node displays more fine-grained detail in the info dialog than in the accordion box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
type RepresentationContext = 'accordion' | 'info';
export default RepresentationContext;