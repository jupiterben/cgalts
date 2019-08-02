import { Point_2, Compare_xy_2, Sign, Int, CGAL_assertion } from "./types";
import { Stack, Queue } from 'std.ts';

/**
 * arragment 半边数据结构
 */

class Arr_vertex_base {
    p_pnt: Point_2;
    p_inc; //from half edge
    point() { return this.p_pnt; }
}

class Arr_vertex extends Arr_vertex_base {

}


class Arr_halfedge_base {
    p_opp;
    p_prev;
    p_next;
    p_v; //to vertex
    p_comp;

    p_cv: X_monotone_curve;
}

class Arr_face_base {
    static IS_UNBOUNDED = 1
    static IS_FICTITIOUS = 2

    flags: Int;      // Face flags.
    outer_ccbs: Array<any>; // The outer CCBs of the faces.
    inner_ccbs: Array<any>; // The inner CCBs of the face.
    iso_verts: Array<any>;  // The isolated vertices inside
    /*! Default constructor. */
    constructor() { this.flags = 0; }
    /*! Check if the face is unbounded. */
    is_unbounded() { return ((this.flags & Arr_face_base.IS_UNBOUNDED) != 0); }
    /*! Set the face as bounded or unbounded. */
    set_unbounded(unbounded) { this.flags = (unbounded) ? (this.flags | Arr_face_base.IS_UNBOUNDED) : (this.flags & ~Arr_face_base.IS_UNBOUNDED); }

    /*! Check if the face is fictitious. */
    is_fictitious() { return ((this.flags & Arr_face_base.IS_FICTITIOUS) != 0); }

    /*! Set the face as fictitious or valid. */
    set_fictitious(fictitious) { this.flags = (fictitious) ? (this.flags | Arr_face_base.IS_FICTITIOUS) : (this.flags & ~Arr_face_base.IS_FICTITIOUS); }

    /*! Assign from another face. */
    assign(f) { this.flags = f.flags; }
}

enum Arr_halfedge_direction {
    ARR_LEFT_TO_RIGHT = -1,
    ARR_RIGHT_TO_LEFT = 1
};

export type Vertex = Arr_vertex_base;
export type Halfedge = Arr_halfedge_base;
export type Face = Arr_face_base;


export function Compare_vertex(v1: Vertex, v2: Vertex) {
    return Compare_xy_2(v1.point(), v2.point());
}


export class Arrangement_on_surface_2 {
    vertices(): Array<Vertex> { return []; }

    *faces() {

    }
    *edges() {

    }
}

export class Arr_entry {
    first: Arrangement_on_surface_2
    second: Array<Vertex>
}



class Surface_sweep_2 {

}


type Edges_hash = Map<Halfedge, Int>;
type Faces_hash = Map<Face, Int>;

type Arrangement_2 = Arrangement_on_surface_2;
class Meta_X_monotone_curve_2 {

}

class Curve_with_halfedge {

}



abstract class Gps_bfs_base_visitor {

    m_edges_hash: Edges_hash;
    m_faces_hash: Faces_hash;
    m_num_of_polygons: Int; // number of polygons

    Gps_bfs_base_visitor(edges_hash, faces_hash, n_pgn) {
        this.m_edges_hash = (edges_hash);
        this.m_faces_hash = (faces_hash);
        this.m_num_of_polygons = (n_pgn)
    }
    //! discovered_face
    /*! discovered_face is called by Gps_bfs_scanner when it reveals a new face 
        during a BFS scan. In the BFS traversal we are going from old_face to 
        new_face throught the half-edge he.
      \param old_face The face that was already revealed
      \param new_face The face that we have just now revealed
      \param he The half-edge that is used to traverse between them.
    */
    discovered_face(old_face, new_face, he) {
        const ic = this.compute_ic(old_face, new_face, he);
        if (this.contained_criteria(ic))
            new_face.set_contained(true);
    }

    // mark the unbounded_face (true iff contained)
    visit_ubf(ubf, ubf_ic) {
        CGAL_assertion(ubf.is_unbounded());
        if (this.contained_criteria(ubf_ic))
            ubf.set_contained(true);
    }



    // compute the inside count of a face
    compute_ic(f1, f2, he) {
        const m_edges_hash = this.m_edges_hash;
        const m_faces_hash = this.m_faces_hash;

        CGAL_assertion(m_edges_hash.is_defined(he) &&
            m_edges_hash.is_defined(he.twin()) &&
            m_faces_hash.is_defined(f1) &&
            !m_faces_hash.is_defined(f2));
        const ic_f2 = (m_faces_hash)[f1] - (m_edges_hash)[he] + (m_edges_hash)[he.twin()];
        (m_faces_hash)[f2] = ic_f2;
        return (ic_f2);
    }

    abstract contained_criteria(n:Int);
};



type Visitor = Gps_bfs_base_visitor;
class Inner_ccb_iterator { }
class Ccb_halfedge_circulator { }

class Gps_bfs_scanner {
    m_holes: Queue<Inner_ccb_iterator>;
    m_ccb_stack: Stack<Ccb_halfedge_circulator>;
    constructor(private visitor: Visitor) {
    }

    scanArr(arr: Arrangement_2) {
        const m_holes = this.m_holes;
        for (let ubf of arr.faces()) {
            if (ubf.number_of_outer_ccbs() != 0)
                continue;
            if (ubf.visited() == true)
                continue;

            ubf.set_visited(true);
            this.push_to_queue_holes_of_face(ubf);

            while (!m_holes.empty()) {
                const hole = m_holes.front();
                m_holes.pop();
                this.scan(hole);
            }
        }

    }

    scan(ccb: Ccb_halfedge_circulator) {
        const m_ccb_stack = this.m_ccb_stack;
        this._scan(ccb);
        while (!m_ccb_stack.empty()) {
            const curr_ccb = m_ccb_stack.top();
            m_ccb_stack.pop();
            this._scan(curr_ccb);
        }

    }
    _scan(ccb: Ccb_halfedge_circulator) {
        const ccb_circ = ccb;
        const ccb_end = ccb;
        let new_f;
        do {
            
            Halfedge_iterator he = ccb_circ;
            new_f = he -> twin() -> face();
            if (!new_f -> visited()) {
                push_to_queue_holes_of_face(he -> twin() -> face());
                new_f -> set_visited(true);
                m_visitor -> discovered_face(he -> face(), new_f, he);

                //scan(he->twin());
                m_ccb_stack.push(he -> twin());
            }
            ++ccb_circ;
        }
        while (ccb_circ != ccb_end);
    }

    push_to_queue_holes_of_face(f) {
        for (Inner_ccb_iterator hit = f -> inner_ccbs_begin();
            hit != f -> inner_ccbs_end(); ++hit)
        {
            m_holes.push(hit);
        }
    }
}



class Gps_agg_op {
    m_arr: Arrangement_2;
    //Mgt2* m_traits;
    m_visitor: Visitor;
    m_surface_sweep: Surface_sweep_2;
    m_edges_hash: Edges_hash;      // maps halfedge to its BC (boundary counter)
    m_faces_hash: Faces_hash;      // maps face to its IC (inside count)

    constructor(arr, vert_vec: Array<Vertex>) {
        this.m_arr = arr;
        this.m_visitor = new Visitor(arr, this.m_edges_hash, vert_vec);
        this.m_surface_sweep = new Surface_sweep_2(m_traits, m_visitor);
    }

    sweep_arrangements(lower, upper, jump, arr_vec) {
        const curves_list = new Array<Meta_X_monotone_curve_2>();

        let n_inf_pgn = 0; // number of infinte polygons (arrangement
        // with a contained unbounded face
        let n_pgn = 0;     // number of polygons (arrangements)       

        for (let i = lower; i <= upper; i += jump, ++n_pgn) {
            // The BFS scan (after the loop) starts in the reference face,
            // so we count the number of polygons that contain the reference face.
            const arr = (arr_vec[i]).first;
            if (arr.reference_face().contained())++n_inf_pgn;

            for (let he of arr.edges) {
                if (he.face().contained() == he.twin().face().contained())
                    continue;
                if (he.direction() == Arr_halfedge_direction.ARR_RIGHT_TO_LEFT)
                    he = he.twin();

                const cv_data = new Curve_with_halfedge(arr, he, 1, 0);
                curves_list.push(new Meta_X_monotone_curve_2(he.curve(), cv_data));
            }

        }

        this.m_surface_sweep.sweep(curves_list.begin(), curves_list.end(),
            lower, upper, jump, arr_vec);

        this.m_faces_hash[this.m_arr.reference_face()] = n_inf_pgn;
        const visitor = new Bfs_visitor(m_edges_hash, m_faces_hash, n_pgn);
        visitor.visit_ubf(this.m_arr.faces_begin(), n_inf_pgn);
        const scanner = new Bfs_scanner(visitor);
        scanner.scan(m_arr);
        visitor.after_scan(m_arr);
    }
}


export class Base_merge {
    merge(i: Int, j: Int, jump: Int, arr_vec: Array<Arr_entry>) {
        if (i == j)
            return;

        // const typename Arrangement_2:: Geometry_traits_2 * tr =
        // arr_vec[i].first . geometry_traits();
        const res = new Arrangement_on_surface_2();
        const verts = new Array<Vertex>();
        const agg_op = new Gps_agg_op(res, verts);
        agg_op.sweep_arrangements(i, j, jump, arr_vec);

        for (let count = i; count <= j; count += jump) {
            delete (arr_vec[count].first);
            delete (arr_vec[count].second);
        }

        arr_vec[i].first = res;
        arr_vec[i].second = verts;
    }
}

export class Join_merge {

}