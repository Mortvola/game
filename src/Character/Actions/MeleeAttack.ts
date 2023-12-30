import { Vec2, Vec4, vec2 } from "wgpu-matrix";
import Script from "../../Script/Script";
import { WorldInterface } from "../../WorldInterface";
import { Action } from "../Actions/Action";
import Actor from "../Actor";
import { findPath2, getOccupants } from "../../Workers/PathPlannerQueue";
import Line from "../../Drawables/Line";
import FollowPath from "../../Script/FollowPath";

class MeleeAttack implements Action {
  type: 'Melee' | 'MoveAndMelee' | 'Move' | 'None' = 'None';

  path: Vec2[] = [];

  distance = 0;

  target: Actor | null = null;

  prepareInteraction(actor: Actor, target: Actor | null, point: Vec4 | null, world: WorldInterface): void {
    if (target && actor.actionsLeft > 0) {
      const wp = actor.getWorldPosition();
      const targetWp = target.getWorldPosition();

      const distance = vec2.distance(
        vec2.create(wp[0], wp[2]),
        vec2.create(targetWp[0], targetWp[2]),
      )

      if (distance > actor.attackRadius + target.occupiedRadius) {
        // To far for a melee attack
        // Find a path to the target...

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const occupants = getOccupants(actor, target, participants, []);

        (async () => {
          const [path, distance, lines, cancelled] = await findPath2(
            actor,
            vec2.create(wp[0], wp[2]),
            vec2.create(targetWp[0], targetWp[2]),
            target.occupiedRadius + actor.occupiedRadius,
            target, occupants,
          )

          if (!cancelled) {
            if (path.length > 0) {
              if (world.pathLines) {
                world.mainRenderPass.removeDrawable(world.pathLines, 'line');
              }

              world.pathLines = new Line(lines);
              world.mainRenderPass.addDrawable(world.pathLines, 'line');

              let distanceToTarget = vec2.distance(path[0], vec2.create(targetWp[0], targetWp[2]));
              distanceToTarget -= target.occupiedRadius  

              this.path = path;
              this.distance = distance;

              if (distanceToTarget < actor.attackRadius) {
                this.type = 'MoveAndMelee';
                this.target = target;

                if (world.focusCallback) {
                  world.focusCallback({
                    hitpoints: target.character.hitPoints,
                    maxHitpoints: target.character.maxHitPoints,
                    percentSuccess: actor.character.percentSuccess(target.character, actor.character.equipped.meleeWeapon!),
                  })
                }
              }
              else {
                this.type = 'Move';
              }
            }
          }
        })();
      }
      else {
        if (world.trajectory) {
          world.mainRenderPass.removeDrawable(world.trajectory, 'trajectory');
          world.trajectory = null;
        }

        if (world.pathLines) {
          world.mainRenderPass.removeDrawable(world.pathLines, 'line');
        }

        this.type = 'Melee';
        this.target = target;

        if (world.focusCallback) {
          world.focusCallback({
            hitpoints: target.character.hitPoints,
            maxHitpoints: target.character.maxHitPoints,
            percentSuccess: actor.character.percentSuccess(target.character, actor.character.equipped.meleeWeapon!),
          })
        }
      }
    }
    else {
      this.target = null;

      if (world.focusCallback) {
        world.focusCallback(null);
      }

      if (world.trajectory) {
        world.mainRenderPass.removeDrawable(world.trajectory, 'trajectory');
        world.trajectory = null;
      }

      if (point || target) {
        const wp = actor.getWorldPosition();
        
        // If there isn't a point but there is a target
        // then use the target's location.
        let targetWp: Vec2;

        if (point) {
          targetWp = vec2.create(point[0], point[2])
        }
        else {
          const tmp = target!.getWorldPosition();
          targetWp = vec2.create(tmp[0], tmp[2])
        }

        let participants = world.participants.turns.filter((a) => a.character.hitPoints > 0);
        const occupants = getOccupants(actor, target, participants, []);

        (async () => {  
          const [path, distance, lines, cancelled] = await findPath2(
            actor,
            vec2.create(wp[0], wp[2]),
            targetWp,
            target ? target.occupiedRadius + actor.occupiedRadius : null,
            target, occupants,
          )
  
          if (!cancelled && !this.target) {
            if (world.pathLines) {
              world.mainRenderPass.removeDrawable(world.pathLines, 'line');
            }
  
            if (path.length > 0) {
              world.pathLines = new Line(lines);
    
              world.mainRenderPass.addDrawable(world.pathLines, 'line');
            }
            else {
              console.log('path length === 0')
            }
  
            this.type = 'Move';
            this.path = path;
            this.distance = distance;
          }
        })();
      }  
    }
  }

  interact(actor: Actor, script: Script, world: WorldInterface): void {
    switch (this.type) {
      case 'Move':
        script.entries.push(new FollowPath(actor.sceneNode, this.path));    
        actor.distanceLeft -= this.distance;

        if (world.pathLines) {
          world.mainRenderPass.removeDrawable(world.pathLines, 'line');
        }
        
        break

      case 'MoveAndMelee':
        if (actor.actionsLeft > 0 && this.target) {
          script.entries.push(new FollowPath(actor.sceneNode, this.path));    
          actor.distanceLeft -= this.distance;
  
          actor.attack(
            this.target!,
            actor.character.equipped.meleeWeapon!,
            world,
            script,
          );
  
          if (world.pathLines) {
            world.mainRenderPass.removeDrawable(world.pathLines, 'line');
          }

          if (actor.actionsLeft > 0) {
            actor.actionsLeft -= 1;
          }    
        }
        break;

      case 'Melee':
        if (actor.actionsLeft > 0 && this.target) {
          actor.attack(
            this.target!,
            actor.character.equipped.meleeWeapon!,
            world,
            script,
          );

          if (actor.actionsLeft > 0) {
            actor.actionsLeft -= 1;
          }    
        }

        break;
    }

    this.type = 'None';
    this.path = [];
    this.target = null;
    this.distance = 0;
  }
}

export default MeleeAttack;
