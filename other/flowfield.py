import numpy as np

def calculate_flow_field(goal, obstacles, weights):
    # Create an empty grid
    grid = np.zeros((WIDTH, HEIGHT, 2))

    # Initialize the queue with the goal
    queue = [goal]

    # Set the vector at the goal to (0, 0)
    grid[goal] = [0, 0]

    # Propagate the flow field values outward from the goal
    while queue:
        curr_pos = queue.pop(0)

        # Calculate the average direction of the neighboring vectors
        avg_direction = np.array([0, 0])
        count = 0
        for neighbor_pos in get_neighbors(curr_pos):
            if not is_obstacle(neighbor_pos, obstacles):
                neighbor_direction = grid[neighbor_pos]
                neighbor_weight = weights[neighbor_pos]
                direction_weighted = neighbor_direction / np.linalg.norm(neighbor_direction) * neighbor_weight
                avg_direction += direction_weighted
                count += 1
        if count > 0:
            avg_direction /= count

        # Set the vector at the current position to point in the average direction
        grid[curr_pos] = avg_direction

        # Add the neighboring positions to the queue
        for neighbor_pos in get_neighbors(curr_pos):
            if not is_obstacle(neighbor_pos, obstacles) and np.all(grid[neighbor_pos] == 0):
                queue.append(neighbor_pos)

    return grid

def follow_flow_field(start, goal, flow_field):
    # Follow the flow field from the start position to the goal position
    path = [start]
    curr_pos = start
    while curr_pos != goal:
        curr_direction = flow_field[curr_pos]
        curr_pos = tuple(np.array(curr_pos) + curr_direction)
        path.append(curr_pos)
    return path

# Main loop
while True:
    # Update obstacle positions
    obstacles = get_obstacle_positions()

    # Calculate weights based on obstacle positions
    weights = calculate_weights(obstacles)

    # Calculate flow field
    flow_field = calculate_flow_field(goal, obstacles, weights)

    # Follow flow field
    path = follow_flow_field(start, goal, flow_field)

    # Move along path
    move_along_path(path)
