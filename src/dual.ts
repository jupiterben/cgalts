
function construct_polygon(circle: Circle_2) {
	// Subdivide the circle into two x-monotone arcs.
	Traits_2 traits;
	Curve_2 curve(circle);
	std:: list < CGAL:: Object > objects;
	traits.make_x_monotone_2_object()(curve, std:: back_inserter(objects));
	CGAL_assertion(objects.size() == 2);
	// Construct the polygon.
	Polygon_2 pgn;
	X_monotone_curve_2 arc;
	std:: list < CGAL:: Object >:: iterator iter;
	for (iter = objects.begin(); iter != objects.end(); ++iter) {
		CGAL:: assign(arc, * iter);
		pgn.push_back(arc);
	}
	return pgn;
}