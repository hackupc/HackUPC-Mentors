defmodule HackUpcMentorsApi.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :email, :string
      add :password_hash, :string
      add :is_admin, :boolean, default: false, null: false
      add :is_mentor, :boolean, default: false, null: false
      add :is_hacker, :boolean, default: false, null: false

      timestamps()
    end

  end
end
